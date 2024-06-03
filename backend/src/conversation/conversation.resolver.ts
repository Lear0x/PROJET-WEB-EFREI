import { Resolver } from "@nestjs/graphql";
import { Conversation } from "./conversation.model";
import { ConversationService } from "./conversation.service";
import { MessageService } from "../message/message.service";

@Resolver(() => Conversation)
export class ConversationResolver {
    constructor(
        private readonly conversationService: ConversationService,
        private readonly messageService: MessageService) 
    {}


}