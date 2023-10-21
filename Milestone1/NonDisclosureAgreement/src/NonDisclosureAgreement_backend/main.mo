import Text "mo:base/Text";
import Hash "mo:base/Hash";
actor {
	public query func greet(name : Text) : async Text {
		return "Hello, " # name # "!";
	};

	public query func return_hash( string : Text ) : async Hash.Hash {
		return Text.hash( string );
	};


	stable var receiver_name: Text = "";
	stable var receiver_date: Text = "";
	stable var receiver_title: Text = "";
	stable var receiver_company: Text = "";
	stable var receiver_address: Text = "";

	stable var sender_name: Text = "";
	stable var sender_date: Text = "";
	stable var sender_title: Text = "";
	stable var sender_company: Text = "";
	stable var sender_address: Text = "";
	stable var document_hash: Text = "";

	public query func get_receiver_name() : async Text {
		return receiver_name;
	};

	public query func get_receiver_date() : async Text {
		return receiver_date;
	};

	public query func get_receiver_title() : async Text {
		return receiver_title;
	};

	public query func get_receiver_company() : async Text {
		return receiver_company;
	};

	public query func get_receiver_address() : async Text {
		return receiver_address;
	};

	public query func get_sender_name() : async Text {
		return sender_name;
	};
	public query func get_sender_date() : async Text {
		return sender_date;
	};

	public query func get_sender_title() : async Text {
		return sender_title;
	};

	public query func get_sender_company() : async Text {
		return sender_company;
	};

	public query func get_sender_address() : async Text {
		return sender_address;
	};

	public query func get_document_hash() : async Text {
		return document_hash;
	};



	public func set_receiver_name( new_receiver_name : Text ) {
		receiver_name := new_receiver_name;
	};

	public func set_receiver_date( new_receiver_date : Text ) {
		receiver_date := new_receiver_date;
	};

	public func set_receiver_title( new_receiver_title : Text ) {
		receiver_title := new_receiver_title;
	};

	public func set_receiver_company( new_receiver_company : Text ) {
		receiver_company := new_receiver_company;
	};

	public func set_receiver_address( new_receiver_address : Text ) {
		receiver_address := new_receiver_address;
	};

	public func set_sender_name( new_sender_name : Text ) {
		sender_name := new_sender_name;
	};

	public func set_sender_date( new_sender_date : Text ) {
		sender_date := new_sender_date;
	};

	public func set_sender_title( new_sender_title : Text ) {
		sender_title := new_sender_title;
	};

	public func set_sender_company( new_sender_company : Text ) {
		sender_company := new_sender_company;
	};

	public func set_sender_address( new_sender_address : Text ) {
		sender_address := new_sender_address;
	};

	public func set_document_hash( new_document_hash : Text ) {
		document_hash := new_document_hash;
	};

};
