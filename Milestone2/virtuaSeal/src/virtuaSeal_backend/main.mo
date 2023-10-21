// 2023-10-01 https://m7sm4-2iaaa-aaaab-qabra-cai.ic0.app/?tag=1952043250 - signatures
// 2023-10-02 https://m7sm4-2iaaa-aaaab-qabra-cai.ic0.app/?tag=2663211090 - added auth levels
// 2023-10-02 https://m7sm4-2iaaa-aaaab-qabra-cai.ic0.app/?tag=1047745918 - consistent switch returns
// 2023-10-02 https://m7sm4-2iaaa-aaaab-qabra-cai.ic0.app/?tag=501838252 - added timestamps to signatures
import Array "mo:base/Array";
import Hash "mo:base/Hash";
import Iter "mo:base/Iter";
import Nat "mo:base/Nat";
import Principal "mo:base/Principal";
import Text "mo:base/Text";
import Time "mo:base/Time";
import Trie "mo:base/Trie";

actor {

  type d__ = {
    id_ : Nat;
    content_ : Text;
    sender_ : Principal;
    target_ : [Principal];
    copied_ : [Principal];
    hash_ : Hash.Hash;
  };

  type t__ = {
    id_ : Nat;
    content_ : Text;
    description_ : Text;
    keywords_ : [Text];
    private_ : Bool;
    sender_ : Principal;
    copied_ : [Principal];
  };

  type s__ = {
    id_ : Nat;
    document_id_ : Text;
    signer_ : Principal;
    initials_ : Text;
    signature_ : Text;
    timestamp_ : Int;
  };

  stable var document_trie_ = Trie.empty<Text, d__>();
  stable var template_trie_ = Trie.empty<Text, t__>();
  stable var signature_trie_ = Trie.empty<Text, s__>();

  // utility functions

  func generic_key(t : Text) : Trie.Key<Text> = { key = t; hash = Text.hash t };
  func document_get(id : Text) : ?d__ = Trie.get(document_trie_, generic_key(id), Text.equal);
  func template_get(id : Text) : ?t__ = Trie.get(template_trie_, generic_key(id), Text.equal);
  func signature_get(id : Text) : ?s__ = Trie.get(signature_trie_, generic_key(id), Text.equal);

  func principal_in(principal : Principal, principals : [Principal]) : Bool {
    switch (Array.find<Principal>(principals, func x = x == principal)) {
      case null return false;
      case (?result) return true;
    };
    return false;
  };

  public query({ caller }) func whoami() : async Principal {
    return caller;
  };


  // check if principal is authorized to read the document: sender, target, copied
  public query func read_authorized(
    index : Text,
    principal : Principal
  ) : async Bool {
    switch (document_get(index)) {
      case null return false;
      case (?temp) {
        if (temp.sender_ == principal or principal_in(principal, temp.target_) or principal_in(principal, temp.copied_)) {
          return true;
        } else {
          return false;
        };
      };
    };
    return false;
  };  

  // check if principal is allowed to sign the document: sender, target
  public query func sign_authorized(
    index : Text,
    principal : Principal
  ) : async Bool {
    switch (document_get(index)) {
      case null return false;
      case (?temp) {
        if (temp.sender_ == principal or principal_in(principal, temp.target_)) {
          return true;
        } else {
          return false;
        };
      };
    };
    return false;
  };  

  // check if principal is allowed to edit the document: sender only
  public query func edit_authorized(
    index : Text,
    principal : Principal
  ) : async Bool {
    switch (document_get(index)) {
      case null return false;
      case (?temp) {
        if (temp.sender_ == principal) {
          return true;
        } else {
          return false;
        };
      };
    };
    return false;
  };   

  // document functions

  // add document
  public shared ({ caller }) func add_document(
    content : Text,
    target : [Principal],
    copied : [Principal],
  ) : async Nat {
    let size_trie : Nat = Trie.size(document_trie_);
    let new_document : d__ = {
      id_ = size_trie;
      sender_ : Principal = caller;
      content_ : Text = content;
      target_ : [Principal] = target;
      copied_ : [Principal] = copied;
      hash_ : Hash.Hash = Text.hash(content);
    };
    document_trie_ := Trie.put(document_trie_, generic_key(Nat.toText(size_trie)), Text.equal, new_document).0;
    return Trie.size(document_trie_);
  };

  // check if document exists
  public query func document_exists( index : Text ) : async Bool {
    let result = switch (document_get(index)) {
      case null return false;
      case (?temp) return true;
    };
    return false;
  };

  // update document, given index and principal
  public shared ({ caller }) func update_document(
    index : Text,
    content : Text,
  ) : async Bool {
    let caller_auth : Bool = await edit_authorized( index, caller );
    let result = switch (document_get(index)) {
      case null return false;
      case (?temp) {
        if (caller_auth) {
          let d : d__ = {
            id_ : Nat = temp.id_;
            sender_ : Principal = temp.sender_;
            target_ : [Principal] = temp.target_;
            copied_ : [Principal] = temp.copied_;
            content_ : Text = content;
            hash_ : Hash.Hash = Text.hash(content);
          };
          document_trie_ := Trie.put(document_trie_, generic_key(index), Text.equal, d).0;
          return true;
        };
      };
    };
    return false;
  };

  // get document given index and principal
  public shared ({ caller }) func get_document(index : Text) : async ?d__ {
    let caller_auth : Bool = await read_authorized( index, caller );
    switch (document_get(index)) {
      case null return null;
      case (?temp) {
        if (caller_auth) {
          return ?temp;
        } else {
          return null;
        };
      };
    };
    return null;
  };

  // how many documents we have
  public query func get_size_documents() : async Nat {
    return Trie.size(document_trie_);
  };

  // get all documents for which a Principal has read access or higher
  public query ({ caller }) func get_documents() : async [d__] {
    let filtered_documents = Trie.filter(
      document_trie_,
      func(_ : Text, d : d__) : Bool = d.sender_ == caller or principal_in(caller, d.target_) or principal_in(caller, d.copied_)
    );
    return Iter.toArray(Iter.map(Trie.iter(filtered_documents), func((t : Text, d : d__)) : d__ = d));
  };

  // template functions

  // add template
  public shared ({ caller }) func add_template(
    content : Text,
    description : Text,
    keywords : [Text],
    priv : Bool,
    copied : [Principal],
  ) : async Nat {
    let size_trie : Nat = Trie.size(template_trie_);
    let new_template : t__ = {
      id_ : Nat = size_trie;
      content_ : Text = content;
      description_ : Text = description;
      keywords_ : [Text] = keywords;
      private_ : Bool = priv;
      sender_ : Principal = caller;
      copied_ : [Principal] = copied;
    };
    template_trie_ := Trie.put(template_trie_, generic_key(Nat.toText(size_trie)), Text.equal, new_template).0;
    return Trie.size(template_trie_);
  };

  // update template
  public shared ({ caller }) func update_template(
    index : Text,
    content : Text,
    description : Text,
    keywords : [Text],
    copied : [Principal],
  ) : async Bool {
    let result = switch (template_get(index)) {
      case null return false;
      case (?temp) {
        if (temp.sender_ == caller) {
          let t : t__ = {
            id_ : Nat = temp.id_;
            content_ : Text = content;
            description_ : Text = description;
            keywords_ : [Text] = keywords;
            private_ : Bool = temp.private_;
            sender_ : Principal = temp.sender_;
            copied_ : [Principal] = temp.copied_;
          };
          template_trie_ := Trie.put(template_trie_, generic_key(index), Text.equal, t).0;
          return true;
        };
      };
    };
    return false;
  };

  // get template given principal
  public query ({ caller }) func get_template(index : Text) : async ?t__ {
    switch (template_get(index)) {
      case null return null;
      case (?temp) {
        if (temp.sender_ == caller or principal_in(caller, temp.copied_) or not temp.private_) {
          return ?temp;
        } else {
          return null;
        };
      };
    };
    return null;
  };

  // how many templates do we have
  public query func get_size_templates() : async Nat {
    return Trie.size(template_trie_);
  };

  // get all templates for which a Principal is sender or copied
  public query ({ caller }) func get_templates() : async [t__] {
    let filtered_templates = Trie.filter(
      template_trie_,
      func(_ : Text, t : t__) : Bool = t.sender_ == caller or principal_in(caller, t.copied_) or not t.private_
    );
    return Iter.toArray(Iter.map(Trie.iter(filtered_templates), func((t : Text, tt : t__)) : t__ = tt));
  };

  // signatures
  public query func signature_exists(
    index : Text,
    caller : Principal
  ) : async Bool {
    let res = Trie.filter( signature_trie_, 
      func(_ : Text, s : s__) : Bool = s.document_id_ == index and s.signer_ == caller );
    return Trie.size(res) > 0;
  };

  // add signature
  public shared ({ caller }) func add_signature(
    document_id : Text,
    initials : Text,
    signature : Text
  ) : async Nat {
    let size_trie : Nat = Trie.size(signature_trie_);
    let doc_exists : Bool = await document_exists( document_id );
    let princ_auth : Bool = await sign_authorized( document_id, caller );
    let sig_exists : Bool = await signature_exists( document_id, caller );

    // check if document exists before adding signature
    if ( not doc_exists ) {
      return size_trie;
    };

    // check if principal is authorized to sign
    if ( not princ_auth ) {
      return size_trie;
    };

    // check if principal has already signed
    if ( sig_exists ) {
      return size_trie;
    };

    let new_signature : s__ = {
      id_ : Nat = size_trie;
      document_id_ : Text = document_id;
      signer_ : Principal = caller;
      initials_ : Text = initials;
      signature_ : Text = signature;
      timestamp_ : Int = Time.now();
    };
    signature_trie_ := Trie.put(signature_trie_, generic_key(Nat.toText(size_trie)), Text.equal, new_signature).0;
    return Trie.size(signature_trie_);
  };

  // get all signatures to a document for which a Principal is sender, target, or copied
  public shared({ caller }) func get_signatures( index : Text ) : async [s__] {
    let filtered_templates = 
      Trie.filter( signature_trie_, func(_ : Text, s : s__) : Bool = s.document_id_ == index );
    return Iter.toArray(Iter.map(Trie.iter(filtered_templates), func((t : Text, ss : s__)) : s__ = ss));
  };

  // how many signatures do we have
  public query func get_size_signatures() : async Nat {
    return Trie.size(signature_trie_);
  };

};
