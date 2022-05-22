import * as functions from 'firebase-functions';
import { makeRunTimeOption, Memory } from '@root/utils/makeRuntimeOptions';
import { config } from '@root/config';
import crypto from 'crypto-js';
import {
    getExistingNricProfile,
    createOrGetEvent,
    registerCheckin,
    registerNameCheckin,
    registerProfile,
} from '@root/attendanceExport/attendance.datastore';
import moment from 'moment-timezone';
import { logger } from '@root/logger';

/**
 * Google Form webhook payload is a flat JSON from question to answer string.
 * To provide a bit of anti-fragility, be spacing+case-insensistive.
 * This matches greedily, so it takes first of multiple matching fields if so.
 **/
function stripFinder(body: Record<string, string>, fieldName: string): string | undefined {
    const rawSearch = fieldName.toLowerCase().replace(/[\W_]+/g, '');
    for (const [k, v] of Object.entries(body)) {
        const rawTitle = k.toLowerCase().replace(/[\W_]+/g, '');
        if (rawTitle.includes(rawSearch)) return v;
    }
    return;
}

async function seeIt(body: Record<string, string>) {
    const eventId = stripFinder(body, 'event');
    const firstName = stripFinder(body, 'first name');
    const lastName = stripFinder(body, 'last name');
    const nric = stripFinder(body, 'nric');
    const mobileNumber = stripFinder(body, 'mobile number');

    logger.info(
        JSON.stringify({
            eventId,
            firstName,
            lastName,
            nric,
            mobileNumber,
        })
    );

    if (!eventId)
        throw new Error(
            'No question with "event" was found, unable to figure out the event. Did you include a question with these key words?'
        );
    else {
        // Ensure the event exists
        await createOrGetEvent(eventId);
    }

    if (nric) {
        const idHash = crypto.MD5(nric).toString();
        const existingProfile = await getExistingNricProfile(idHash);
        if (existingProfile) {
            await registerCheckin(idHash, eventId);
        } else if (
            firstName !== undefined &&
            lastName !== undefined &&
            mobileNumber !== undefined
        ) {
            await registerProfile({
                idHash,
                firstName,
                lastName,
                phone: mobileNumber,
                createdAt: moment().unix(),
            });
            await registerCheckin(idHash, eventId);
        } else {
            const missingFields = [
                firstName ? undefined : 'first name',
                lastName ? undefined : 'last name',
                mobileNumber ? undefined : 'contact number',
            ]
                .filter(e => e !== undefined)
                .join(', ')

            throw new Error(
                `Attempting to register profile for new participant but some missing fields in form submission: ${missingFields}. Did you include a question with these key words?`
            );
        }
    } else if (firstName !== undefined && lastName !== undefined && mobileNumber !== undefined) {
        await registerNameCheckin(`${firstName} ${lastName}`, mobileNumber, eventId);
    } else {
        throw new Error(
            `Could not find enough identifying fields. Did you add questions with following key words? nric, contact number, first name, last name.`
        );
    }
}

export const formSubmission = functions
    .runWith(makeRunTimeOption(Memory.GB, 9))
    .region(config.region)
    .https.onRequest(async (req, res) => {
        if (req.method === 'POST') {
            try {
                await seeIt(req.body);
                res.status(200).send();
            } catch (error: unknown) {
                logger.error(error)
                res.status(500).send({error})
            }
        }
    });
