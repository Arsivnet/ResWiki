import * as borsh from '@project-serum/borsh'

export class Article {
    title: string;
    rating: number;
    description: string;

    constructor(title: string, rating: number, description: string) {
        this.title = title;
        this.rating = rating;
        this.description = description;
    }


     static mocks: Article[] = [
        new Article('Conquest of Constantinople', 5, `The fall of Constantinople, also known as the conquest of Constantinople, was the capture of the capital of the Byzantine Empire by the Ottoman Empire. The city was captured on 29 May     1453[15][16] as part of the culmination of a 53-day siege which had begun on 6 April.`),
        new Article('Indian independence movement', 5, `The Indian independence movement was a series of historic events with the ultimate aim of ending British rule in India. It lasted from 1857 to 1947. The first nationalistic revolutionary movement for Indian independence emerged from Bengal. It later took root in the newly formed Indian National Congress with prominent moderate leaders seeking the right to appear for Indian Civil Service examinations in British India, as well as more economic rights for natives. The first half of the 20th century saw a more radical approach towards self-rule by the Lal Bal Pal triumvirate, Aurobindo Ghosh and V. O. Chidambaram Pillai.`),
        new Article('2023 Estonian parliamentary election', 5, `Parliamentary elections were held in Estonia on 5 March 2023 to elect all 101 members of the Riigikogu. The Estonian Centre Party, led by Jüri Ratas, formed a government after the 2019 Estonian parliamentary election, with Ratas serving as prime minister. His government was brought down in January 2021 after a corruption investigation; Kaja Kallas of the Estonian Reform Party formed a coalition government with the Centre Party afterward, although it collapsed in June 2022. `),
        new Article('Shirley Kurata', 4, `Shirley Kurata (born c. 1970)[1] is an American wardrobe stylist and costume designer based in Los Angeles, California. In 2023, she is a nominee for the Academy Award for Best Costume Design, for her work on the indie film Everything Everywhere All at Once.[2] Kurata has won numerous awards including the Costume Designers Guild Award for Excellence in Sci-Fi/Fantasy Film.[3]`),
    ]

    borshInstructionSchema = borsh.struct([
        borsh.u8('variant'),
        borsh.str('title'),
        borsh.u8('rating'),
        borsh.str('description'),
    ])

    static borshAccountSchema = borsh.struct([
        borsh.bool('initialized'),
        borsh.u8('rating'),
        borsh.str('title'),
        borsh.str('description'),
    ])

    serialize(): Buffer {
        const buffer = Buffer.alloc(1000)
        this.borshInstructionSchema.encode({ ...this, variant: 0 }, buffer)
        return buffer.slice(0, this.borshInstructionSchema.getSpan(buffer))
    }

    static deserialize(buffer?: Buffer): Article | null {
        if (!buffer) {
            return null
        }

        try {
            const { title, rating, description } = this.borshAccountSchema.decode(buffer)
            return new Article(title, rating, description)
        } catch (e) {
            console.log('Deserialization error:', e)
            console.log(buffer)
            return null
        }
    }
}
