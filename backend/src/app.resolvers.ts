import { Resolver, Query } from '@nestjs/graphql';

@Resolver()
export class AppResolver {
    @Query(() => String)
    getResult(): string {
        return JSON.stringify({ result: 'ok' });
    }
}
