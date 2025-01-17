import bs58 from 'bs58'
import * as web3 from '@solana/web3.js'
import { Article } from '../models/Article'

const MOVIE_REVIEW_PROGRAM_ID = '2RLstbdoryEXD8gVmJ2LduiXXSMSYiuUXH7hCmk2aB7D'

export class ArticleCoordinator {
    static accounts: web3.PublicKey[] = []

    static async prefetchAccounts(connection: web3.Connection, search: string) {
        const accounts = await connection.getProgramAccounts(
            new web3.PublicKey(MOVIE_REVIEW_PROGRAM_ID),
            {
                dataSlice: { offset: 2, length: 18 },
                filters: search === '' ? [] : [
                    { 
                        memcmp: 
                            { 
                                offset: 6, 
                                bytes: bs58.encode(Buffer.from(search))
                            }
                    }
                ]
            }
        )

        accounts.sort( (a, b) => {
            const lengthA = a.account.data.readUInt32LE(0)
            const lengthB = b.account.data.readUInt32LE(0)
            const dataA = a.account.data.slice(4, 4 + lengthA)
            const dataB = b.account.data.slice(4, 4 + lengthB)
            return dataA.compare(dataB)
        })

        this.accounts = accounts.map(account => account.pubkey)
    }

    static async fetchPage(connection: web3.Connection, page: number, perPage: number, search: string, reload: boolean = false): Promise<Article[]> {
        if (this.accounts.length === 0 || reload) {
            await this.prefetchAccounts(connection, search)
        }

        const paginatedPublicKeys = this.accounts.slice(
            (page - 1) * perPage,
            page * perPage,
        )

        if (paginatedPublicKeys.length === 0) {
            return []
        }

        const accounts = await connection.getMultipleAccountsInfo(paginatedPublicKeys)

        const articles = accounts.reduce((accum: Article[], account) => {
            const article = Article.deserialize(account?.data)
            if (!article) {
                return accum
            }

            return [...accum, article]
        }, [])

        return articles
    }
}
