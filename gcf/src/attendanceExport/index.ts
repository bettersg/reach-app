import { Checkin, getEventsOnDate, getExistingNricProfile, getEventCheckins } from './attendance.datastore';
import ExcelJS from 'exceljs';  // https://www.npmjs.com/package/exceljs
import * as functions from 'firebase-functions';
import { makeRunTimeOption, Memory } from '@root/utils/makeRuntimeOptions';
import { config } from '@root/config';
import moment from 'moment-timezone';

const THIN_BORDER = {
    top: {style:'thin'},
    left: {style:'thin'},
    bottom: {style:'thin'},
    right: {style:'thin'}
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

    for (let monthDiff = 1; monthDiff >= 0; monthDiff -= 1) {
        const time = moment().tz('Asia/Singapore').subtract(monthDiff, 'month');
        const sheet = workbook.addWorksheet(time.format('MMMM YYYY'));

        // Accumulator collections for the rectangular matrix
        const allNames = new Set<string>();
        const days: Set<string>[] = [];

        for (let day = 0; day < time.daysInMonth(); day += 1) {
            const events = await getEventsOnDate(time.clone().date(day));
            const attendees = new Set<string>();
    
            await Promise.all(events.map(async (event) => {
                const checkins = await getEventCheckins(event.eventId).then(rawCheckins => Promise.all(rawCheckins.map(convert)));
                for (const checkin of checkins) {
                    attendees.add(checkin.fullName);
                    allNames.add(checkin.fullName);
                }
            }));
    
            days.push(attendees);
        }
        
        const sortedNames = Array.from(allNames).sort();

        // Name column
        const nameColumn = sheet.getColumn(1);
        nameColumn.values = ['Full Name', ...sortedNames];
        nameColumn.width = 30;

        for (let day = 0; day < time.daysInMonth(); day += 1) {
            const column = sheet.getColumn(day + 2)
            column.values = [day + 1, ...sortedNames.map(name => days[day].has(name) ? '✓' : '')];
            column.width = 4;
        }

        // Other formatting
        sheet.getRow(1).height = 20
        for (let c = 1; c <= time.daysInMonth() + 1; c += 1) {
            const isWeekend = c !== 1 && [0, 6].includes(time.clone().date(c - 2).day());
            for (let r = 1; r <= sortedNames.length + 1; r += 1) {
                const cell = sheet.getCell(r, c);
                if (isWeekend) cell.fill = {type: 'pattern', pattern: 'solid', fgColor: {argb: '999999'}}
                if (r === 1) cell.font = {bold: true, name: 'Calibri (Body)'};
                if (r === 1) cell.fill = {type: 'pattern', pattern: 'solid', fgColor: {argb: 'DDDDDD'}}
                cell.alignment = { vertical: 'middle', horizontal: c === 1 ? 'left' : 'center'};
                cell.border = THIN_BORDER;
            }
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
        res.setHeader("Content-Disposition", "attachment; filename=" + `Attendance Records ${moment().format('DD-MM-YYYY')}.xlsx`);
        await writeExcel(res);
    }
});
