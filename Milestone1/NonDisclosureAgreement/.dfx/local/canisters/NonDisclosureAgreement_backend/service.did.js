export const idlFactory = ({ IDL }) => {
  const Hash = IDL.Nat32;
  return IDL.Service({
    'get_document_hash' : IDL.Func([], [IDL.Text], ['query']),
    'get_receiver_address' : IDL.Func([], [IDL.Text], ['query']),
    'get_receiver_company' : IDL.Func([], [IDL.Text], ['query']),
    'get_receiver_date' : IDL.Func([], [IDL.Text], ['query']),
    'get_receiver_name' : IDL.Func([], [IDL.Text], ['query']),
    'get_receiver_title' : IDL.Func([], [IDL.Text], ['query']),
    'get_sender_address' : IDL.Func([], [IDL.Text], ['query']),
    'get_sender_company' : IDL.Func([], [IDL.Text], ['query']),
    'get_sender_date' : IDL.Func([], [IDL.Text], ['query']),
    'get_sender_name' : IDL.Func([], [IDL.Text], ['query']),
    'get_sender_title' : IDL.Func([], [IDL.Text], ['query']),
    'greet' : IDL.Func([IDL.Text], [IDL.Text], ['query']),
    'return_hash' : IDL.Func([IDL.Text], [Hash], ['query']),
    'set_document_hash' : IDL.Func([IDL.Text], [], ['oneway']),
    'set_receiver_address' : IDL.Func([IDL.Text], [], ['oneway']),
    'set_receiver_company' : IDL.Func([IDL.Text], [], ['oneway']),
    'set_receiver_date' : IDL.Func([IDL.Text], [], ['oneway']),
    'set_receiver_name' : IDL.Func([IDL.Text], [], ['oneway']),
    'set_receiver_title' : IDL.Func([IDL.Text], [], ['oneway']),
    'set_sender_address' : IDL.Func([IDL.Text], [], ['oneway']),
    'set_sender_company' : IDL.Func([IDL.Text], [], ['oneway']),
    'set_sender_date' : IDL.Func([IDL.Text], [], ['oneway']),
    'set_sender_name' : IDL.Func([IDL.Text], [], ['oneway']),
    'set_sender_title' : IDL.Func([IDL.Text], [], ['oneway']),
  });
};
export const init = ({ IDL }) => { return []; };
