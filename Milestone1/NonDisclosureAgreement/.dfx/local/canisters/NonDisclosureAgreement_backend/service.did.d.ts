import type { Principal } from '@dfinity/principal';
import type { ActorMethod } from '@dfinity/agent';

export type Hash = number;
export interface _SERVICE {
  'get_document_hash' : ActorMethod<[], string>,
  'get_receiver_address' : ActorMethod<[], string>,
  'get_receiver_company' : ActorMethod<[], string>,
  'get_receiver_date' : ActorMethod<[], string>,
  'get_receiver_name' : ActorMethod<[], string>,
  'get_receiver_title' : ActorMethod<[], string>,
  'get_sender_address' : ActorMethod<[], string>,
  'get_sender_company' : ActorMethod<[], string>,
  'get_sender_date' : ActorMethod<[], string>,
  'get_sender_name' : ActorMethod<[], string>,
  'get_sender_title' : ActorMethod<[], string>,
  'greet' : ActorMethod<[string], string>,
  'return_hash' : ActorMethod<[string], Hash>,
  'set_document_hash' : ActorMethod<[string], undefined>,
  'set_receiver_address' : ActorMethod<[string], undefined>,
  'set_receiver_company' : ActorMethod<[string], undefined>,
  'set_receiver_date' : ActorMethod<[string], undefined>,
  'set_receiver_name' : ActorMethod<[string], undefined>,
  'set_receiver_title' : ActorMethod<[string], undefined>,
  'set_sender_address' : ActorMethod<[string], undefined>,
  'set_sender_company' : ActorMethod<[string], undefined>,
  'set_sender_date' : ActorMethod<[string], undefined>,
  'set_sender_name' : ActorMethod<[string], undefined>,
  'set_sender_title' : ActorMethod<[string], undefined>,
}
