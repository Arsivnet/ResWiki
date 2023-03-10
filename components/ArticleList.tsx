import { Card } from './Card'
import { FC, useEffect, useMemo, useState } from 'react'
import { Movie } from '../models/Movie'
import * as web3 from '@solana/web3.js'
import { ArticleCoordinator } from '../coordinators/ArticleCoordinator'
import { Button, Center, HStack, Input, Spacer } from '@chakra-ui/react'

export const ArticleList: FC = () => {
    const connection = new web3.Connection(web3.clusterApiUrl('devnet'))
    const [articles, setArticles] = useState<Article[]>([])
    const [page, setPage] = useState(1)
    const [search, setSearch] = useState('')

    useEffect(() => {
        ArticleCoordinator.fetchPage(
            connection, 
            page, 
            5,
            search,
            search !== ''
        ).then(setArticles)
    }, [page, search])
    
    return (
        <div>
            <Center>
                <Input
                    id='search'
                    color='gray.400'
                    onChange={event => setSearch(event.currentTarget.value)}
                    placeholder='Search'
                    w='97%'
                    mt={2}
                    mb={2}
                />
            </Center>
            {
                articles.map((article, i) => <Card key={i} article={article} /> )
            }
            <Center>
                <HStack w='full' mt={2} mb={8} ml={4} mr={4}>
                    {
                        page > 1 && <Button onClick={() => setPage(page - 1)}>Previous</Button>
                    }
                    <Spacer />
                    {
                        ArticleCoordinator.accounts.length > page * 5 &&
                        <Button onClick={() => setPage(page + 1)}>Next</Button>
                    }
                </HStack>
            </Center>
        </div>
    )
}
