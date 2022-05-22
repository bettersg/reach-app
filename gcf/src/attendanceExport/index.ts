import {
    Checkin,
    getExistingNricProfile,
    getEventCheckins,
    getAllEvents,
} from './attendance.datastore';
import ExcelJS from 'exceljs'; // https://www.npmjs.com/package/exceljs
import * as functions from 'firebase-functions';
import { makeRunTimeOption, Memory } from '@root/utils/makeRuntimeOptions';
import { config } from '@root/config';
import moment from 'moment-timezone';

const THIN_BORDER = {
    top: { style: 'thin' },
    left: { style: 'thin' },
    bottom: { style: 'thin' },
    right: { style: 'thin' },
} as const;

export async function convert(checkin: Checkin) {
    if (checkin.identity === 'PROFILE') {
        const profile = await getExistingNricProfile(checkin.idHash);

        return {
            fullName: `${profile?.firstName} ${profile?.lastName}`,
            eventId: checkin.eventId,
        };
    }
    return {
        fullName: checkin.fullName,
        eventId: checkin.eventId,
    };
}

export async function writeExcel(res: functions.Response) {
    const workbook = new ExcelJS.Workbook();
    const sheet = workbook.addWorksheet('Attendance');

    // Accumulator collections for the rectangular matrix
    const allNames = new Set<string>();
    const attendees = new Set<string>();
    const roster: Set<string>[] = []
    const eventNames: string[] = []

    const events = await getAllEvents();

    for (const event of events) {
        const checkins = await getEventCheckins(event.eventId).then((rawCheckins) =>
            Promise.all(rawCheckins.map(convert))
        );
        for (const checkin of checkins) {
            if (checkin.fullName.includes('undefined')) {
                console.log(checkin)
                continue
            }
            attendees.add(checkin.fullName);
            allNames.add(checkin.fullName);
        }

        if (attendees.size === 0) continue

        eventNames.push(event.eventId)
        roster.push(new Set(attendees));
        attendees.clear()
    }

    const sortedNames = Array.from(allNames).sort();

    // Name column
    const nameColumn = sheet.getColumn(1);
    nameColumn.values = ['Full Name', ...sortedNames];
    nameColumn.width = 40;

    for (let i = 0; i < eventNames.length; i += 1) {
        const column = sheet.getColumn(i + 2);
        column.values = [
            eventNames[i],
            ...sortedNames.map((name) => (roster[i].has(name) ? '✓' : '')),
        ];
        column.width = 12;
    }

    // Other formatting
    sheet.getRow(1).height = 35;
    for (let c = 1; c <= eventNames.length + 1; c += 1) {
        for (let r = 1; r <= sortedNames.length + 1; r += 1) {
            const cell = sheet.getCell(r, c);
            if (r === 1) cell.font = { bold: true, name: 'Calibri (Body)' };
            if (r === 1)
                cell.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'DDDDDD' } };
            cell.alignment = { vertical: 'middle', horizontal: c === 1 ? 'left' : 'center', wrapText: true };
            cell.border = THIN_BORDER;
        }
    }


    await workbook.xlsx.write(res);
}

export const attendanceExport = functions
    .runWith(makeRunTimeOption(Memory.GB, 9))
    .region(config.region)
    .https.onRequest(async (req, res) => {
        if (req.method === 'GET') {
            res.setHeader('Content-Type', 'application/vnd.openxmlformats');
            res.setHeader(
                'Content-Disposition',
                'attachment; filename=' + `Attendance Records ${moment().format('DD-MM-YYYY')}.xlsx`
            );
            await writeExcel(res);
        }
    });
