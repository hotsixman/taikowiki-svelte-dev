import { runQuery } from "@sveltekit-board/db";
//import {escape} from 'mysql';
import { type SongData, type SongRequest } from "./types";

export default class SongDB {
    static async createTable() {
        await runQuery(async (run) => {
            await run(`CREATE TABLE \`song\` (
                \`songNo\` tinytext NOT NULL,
                \`order\` int(11) NOT NULL,
                \`title\` text NOT NULL,
                \`titleKo\` text DEFAULT NULL,
                \`aliasKo\` text DEFAULT NULL,
                \`titleEn\` text DEFAULT NULL,
                \`aliasEn\` text DEFAULT NULL,
                \`bpm\` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_bin NOT NULL CHECK (json_valid(\`bpm\`)),
                \`bpmShiver\` tinyint(1) NOT NULL,
                \`version\` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_bin NOT NULL CHECK (json_valid(\`version\`)),
                \`isAsiaBanned\` tinyint(1) NOT NULL,
                \`isKrBanned\` tinyint(1) NOT NULL,
                \`genre\` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_bin NOT NULL CHECK (json_valid(\`genre\`)),
                \`artists\` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_bin NOT NULL CHECK (json_valid(\`artists\`)),
                \`addedDate\` bigint(20) NOT NULL,
                \`courses\` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_bin NOT NULL CHECK (json_valid(\`courses\`)),
                \`isDeleted\` tinyint(1) NOT NULL DEFAULT 0
              ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
            `);
            await run(`ALTER TABLE \`song\` ADD PRIMARY KEY (\`order\`);`);
            await run("ALTER TABLE `song` MODIFY `order` int(11) NOT NULL AUTO_INCREMENT;");
        })
    }

    static async getAll(): Promise<SongData[]> {
        return await runQuery(async (run) => {
            let result = await run("SELECT * FROM `song` ORDER BY `addedDate` DESC;");
            result.forEach((e: any) => {
                e.courses = JSON.parse(e.courses);
                e.bpm = JSON.parse(e.bpm);
                e.version = JSON.parse(e.version);
                e.genre = JSON.parse(e.genre);
                e.artists = JSON.parse(e.artists);
            })
            return JSON.parse(JSON.stringify(result))
        })
    }

    static async getBySongNo(songNo: string): Promise<SongData | null> {
        return await runQuery(async (run) => {
            let result = await run("SELECT * FROM `song` WHERE `songNo` = ?", [songNo]);
            result.map((e: any) => {
                e.courses = JSON.parse(e.courses);
                e.bpm = JSON.parse(e.bpm);
                e.version = JSON.parse(e.version);
                e.genre = JSON.parse(e.genre);
                e.artists = JSON.parse(e.artists);
                if (e.courses.ura === undefined) {
                    e.courses.ura = null;
                }
            })
            return (JSON.parse(JSON.stringify(result)) as SongData[])[0] ?? null;
        })
    }

    static async addSong(data: SongData) {
        return await runQuery(async (run) => {
            return await run(`INSERT INTO \`song\` (
                \`songNo\`, 
                \`title\`,
                \`titleKo\`,
                \`aliasKo\`,
                \`titleEn\`,
                \`aliasEn\`,
                \`bpm\`,
                \`bpmShiver\`,
                \`version\`,
                \`isAsiaBanned\`,
                \`isKrBanned\`,
                \`genre\`,
                \`artists\`,
                \`addedDate\`,
                \`courses\`
            ) VALUES (
                ?,?,?,?,?,?,?,?,?,?,?,?,?,?,?
            )`, [
                data.songNo,
                data.title,
                data.titleKo,
                data.aliasKo,
                data.titleEn,
                data.aliasEn,
                JSON.stringify(data.bpm),
                data.bpmShiver,
                JSON.stringify(data.version),
                data.isAsiaBanned,
                data.isKrBanned,
                JSON.stringify(data.genre),
                JSON.stringify(data.artists),
                data.addedDate || 0,
                JSON.stringify(data.courses)
            ])
        })
    }

    static async getUpdateTime(): Promise<number> {
        let result = await runQuery(async (run) => {
            return run(`SELECT \`UPDATE_TIME\` FROM INFORMATION_SCHEMA.TABLES WHERE TABLE_SCHEMA = '${process.env.DB_DATABASE}' AND TABLE_NAME = 'song';`);
        })

        const updateTime = new Date(result[0]['UPDATE_TIME']).getTime();

        return updateTime;
    }

    static async getCreateTime(): Promise<number> {
        let result = await runQuery(async (run) => {
            return run(`SELECT \`CREATE_TIME\` FROM INFORMATION_SCHEMA.TABLES WHERE TABLE_SCHEMA = '${process.env.DB_DATABASE}' AND TABLE_NAME = 'song';`);
        })

        const updateTime = new Date(result[0]['CREATE_TIME']).getTime();

        return updateTime;
    }

    static async getNewSongs(): Promise<SongData[]> {
        return await runQuery(async (run) => {
            let result = await run("SELECT * FROM `song` ORDER BY `addedDate` DESC LIMIT 3");
            result.map((e: any) => {
                e.courses = JSON.parse(e.courses);
                e.bpm = JSON.parse(e.bpm);
                e.version = JSON.parse(e.version);
                e.genre = JSON.parse(e.genre);
                e.artists = JSON.parse(e.artists);
            })
            return JSON.parse(JSON.stringify(result))
        })
    }

    static async uploadSong(songData: SongData) {
        return await runQuery(async (run) => {
            const count = (await run("SELECT COUNT(*) FROM `song` WHERE `songNo` = ?", [songData.songNo]))[0]['COUNT(*)'];
            if (count == 0) {
                return await run("INSERT INTO `song` (`songNo`, `title`, `titleKo`, `aliasKo`, `titleEn`, `aliasEn`, `bpm`, `bpmShiver`, `version`, `isAsiaBanned`, `isKrBanned`, `genre`, `artists`, `addedDate`, `courses`, `isDeleted`) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)", [songData.songNo, songData.title, songData.titleKo, songData.aliasKo, songData.titleEn, songData.aliasEn, JSON.stringify(songData.bpm), songData.bpmShiver, JSON.stringify(songData.version), songData.isAsiaBanned, songData.isKrBanned, JSON.stringify(songData.genre), JSON.stringify(songData.artists), songData.addedDate, JSON.stringify(songData.courses), songData.isDeleted])
            }
            else {
                return await run("UPDATE `song` SET `title` = ?, `titleKo` = ?, `aliasKo` = ?, `titleEn` = ?, `aliasEn` = ?, `bpm` = ?, `bpmShiver` = ?, `version` = ?, `isAsiaBanned` = ?, `isKrBanned` = ?, `genre` = ?, `artists` = ?, `addedDate` = ?, `courses` = ?, `isDeleted` = ? WHERE `songNo` = ?", [songData.title, songData.titleKo, songData.aliasKo, songData.titleEn, songData.aliasEn, JSON.stringify(songData.bpm), songData.bpmShiver, JSON.stringify(songData.version), songData.isAsiaBanned, songData.isKrBanned, JSON.stringify(songData.genre), JSON.stringify(songData.artists), songData.addedDate, JSON.stringify(songData.courses), songData.isDeleted, songData.songNo])
            }
        })
    }
    /*
    static async search(option: SongSearchOption): Promise<SongData[]> {
        let title = option.title?.replace('%', '\\%').replace('_', '\\_') ?? '%';
        let difficultyQuery = option.difficulty && option.level? `AND JSON_EXTRACT(courses, ${escape(`$.${option.difficulty}.level`)}) = ${escape(option.level)}` : '';

        let result = await runQuery(async (run) => {
            return await run(`SELECT * FROM \`song\`
            WHERE
                (\`title\` LIKE ? OR \`titleKo\` LIKE ? OR \`titleEn\` LIKE ? OR \`aliasKo\` LIKE ? OR \`aliasEn\` LIKE ?)
                ${difficultyQuery}
            `, [title, title, title, title, title])
        })

        result.map((song:any) => {
            song.courses = JSON.parse(song.courses)
        })

        return JSON.parse(JSON.stringify(result))
    }
    */
}

export class SongRequestController {
    static async getAll(): Promise<(SongRequest & { order: number })[]> {
        return await runQuery(async (run) => {
            return (await run("SELECT * FROM `song/request` ORDER BY createdTime DESC")).map((request: any) => {
                request.data = JSON.parse(request.data);
                return request;
            })
        })
    }

    static async getRequestsBySongNo(songNo: string, order?: string): Promise<(SongRequest & { order: number })[]> {
        if (order !== undefined) {
            return await runQuery(async (run) => {
                return (await run("SELECT * FROM `song/request` WHERE `songNo` = ? AND `order` = ? ORDER BY createdTime DESC", [songNo, order])).map((request: any) => {
                    request.data = JSON.parse(request.data);
                    return request;
                })
            })
        }
        return await runQuery(async (run) => {
            return (await run("SELECT * FROM `song/request` WHERE `songNo` = ? ORDER BY createdTime DESC", [songNo])).map((request: any) => {
                request.data = JSON.parse(request.data);
                return request;
            })
        })
    }

    static async getRequestByOrder(order: string): Promise<(SongRequest & { order: number }) | null> {
        return await runQuery(async (run) => {
            const result = await run("SELECT * FROM `song/request` WHERE `order` = ? ORDER BY createdTime DESC", [order]);
            if (result.length === 0) return null;

            const request = result[0];
            request.data = JSON.parse(request.data);

            return request;
        }) as (SongRequest & { order: number }) | null
    }

    static async createRequest(request: {
        UUID: string;
        songNo: string;
        data: SongData;
        ip:string;
    }) {
        const song = await SongDB.getBySongNo(request.songNo);

        if (song !== null) {//새곡아님
            return await runQuery(async (run) => {
                await run(`INSERT INTO \`song/request\` (\`UUID\`, \`ip\`, \`songNo\`, \`createdTime\`, \`type\`, \`data\`) VALUES (?, ?, ?, ?, ?, ?)`, [request.UUID, request.ip, request.songNo, Date.now(), 'edit', JSON.stringify(request.data)])
            })
        }
        else {//새곡임
            return await runQuery(async (run) => {
                await run(`INSERT INTO \`song/request\` (\`UUID\`, \`ip\`, \`songNo\`, \`createdTime\`, \`type\`, \`data\`) VALUES (?, ?, ?, ?, ?, ?)`, [request.UUID, request.ip, request.songNo, Date.now(), 'new', JSON.stringify(request.data)])
            })
        }
    }

    static async removeRequest(order: string, songNo?: string) {
        if (songNo !== undefined) {
            return await runQuery(async (run) => {
                return await run("DELETE FROM `song/request` WHERE `order` <= ? AND `songNo` = ?", [order, songNo]);
            })
        }

        return await runQuery(async (run) => {
            return await run("DELETE FROM `song/request` WHERE `order` = ?", [order]);
        })
    }
}

/*
export interface SongSearchOption {
    title?: string;
    difficulty?: Difficulty;
    level?: number;
}
*/

