import { NonDisclosureAgreement_backend } from "../../declarations/NonDisclosureAgreement_backend";

function replaceInstances( string_id, string_value ) {
	var elements = document.getElementsByName( string_id )
	for ( var i = 0; i < elements.length; i++ ) {
		elements[ i ].innerText = string_value;
	}
}

document.querySelector("form").addEventListener("submit", async (e) => {

	// get variables from HTML input
	e.preventDefault();
	const button = e.target.querySelector("button");

	const receiver_name = document.getElementById("receiver_name").value.toString();
	const receiver_date = document.getElementById("receiver_date").value.toString();
	const receiver_title = document.getElementById("receiver_title").value.toString();
	const receiver_company = document.getElementById("receiver_company").value.toString();
	const receiver_address = document.getElementById("receiver_address").value.toString();

	const sender_name = document.getElementById("sender_name").value.toString();
	const sender_date = document.getElementById("sender_date").value.toString();
	const sender_title = document.getElementById("sender_title").value.toString();
	const sender_company = document.getElementById("sender_company").value.toString();
	const sender_address = document.getElementById("sender_address").value.toString();

	button.setAttribute("disabled", true);


	// interact with the actor calling SET methods
	var res_set_receiver_name = await NonDisclosureAgreement_backend.set_receiver_name( receiver_name );
	console.log( "set receiver_name on the blockchain" );
	var res_set_receiver_date = await NonDisclosureAgreement_backend.set_receiver_date( receiver_date );
	console.log( "set receiver_date on the blockchain" );
	var res_set_receiver_title = await NonDisclosureAgreement_backend.set_receiver_title( receiver_title );
	console.log( "set receiver_title on the blockchain" );
	var res_set_receiver_company = await NonDisclosureAgreement_backend.set_receiver_company( receiver_company );
	console.log( "set receiver_company on the blockchain" );
	var res_set_receiver_address = await NonDisclosureAgreement_backend.set_receiver_address( receiver_address );
	console.log( "set receiver_address on the blockchain" );

	var res_set_sender_name = await NonDisclosureAgreement_backend.set_sender_name( sender_name );
	console.log( "set sender_name on the blockchain" );
	var res_set_sender_date = await NonDisclosureAgreement_backend.set_sender_date( sender_date );
	console.log( "set sender_date on the blockchain" );
	var res_set_sender_title = await NonDisclosureAgreement_backend.set_sender_title( sender_title );
	console.log( "set sender_title on the blockchain" );
	var res_set_sender_company = await NonDisclosureAgreement_backend.set_sender_company( sender_company );
	console.log( "set sender_company on the blockchain" );
	var res_set_sender_address = await NonDisclosureAgreement_backend.set_sender_address( sender_address );
	console.log( "set sender_address on the blockchain" );


	// interact with the actor calling GET methods
	const res_get_receiver_name = await NonDisclosureAgreement_backend.get_receiver_name();
	console.log( "get receiver_name from the blockchain" );
	const res_get_receiver_date = await NonDisclosureAgreement_backend.get_receiver_date();
	console.log( "get receiver_date from the blockchain" );
	const res_get_receiver_title = await NonDisclosureAgreement_backend.get_receiver_title();
	console.log( "get receiver_title from the blockchain" );
	const res_get_receiver_company = await NonDisclosureAgreement_backend.get_receiver_company();
	console.log( "get receiver_company from the blockchain" );
	const res_get_receiver_address = await NonDisclosureAgreement_backend.get_receiver_address();
	console.log( "get receiver_address from the blockchain" );

	const res_get_sender_name = await NonDisclosureAgreement_backend.get_sender_name();
	console.log( "get sender_name from the blockchain" );
	const res_get_sender_date = await NonDisclosureAgreement_backend.get_sender_date();
	console.log( "get sender_date from the blockchain" );
	const res_get_sender_title = await NonDisclosureAgreement_backend.get_sender_title();
	console.log( "get sender_title from the blockchain" );
	const res_get_sender_company = await NonDisclosureAgreement_backend.get_sender_company();
	console.log( "get sender_company from the blockchain" );
	const res_get_sender_address = await NonDisclosureAgreement_backend.get_sender_address();
	console.log( "get sender_address from the blockchain" );


	button.removeAttribute("disabled");

	replaceInstances( "nda_sender_name", res_get_sender_name );
	replaceInstances( "nda_sender_date", res_get_sender_date );
	replaceInstances( "nda_sender_title", res_get_sender_title );
	replaceInstances( "nda_sender_company", res_get_sender_company );
	replaceInstances( "nda_sender_address", res_get_sender_address );
	replaceInstances( "nda_receiver_name", res_get_receiver_name );
	replaceInstances( "nda_receiver_date", res_get_receiver_date );
	replaceInstances( "nda_receiver_title", res_get_receiver_title );
	replaceInstances( "nda_receiver_company", res_get_receiver_company );
	replaceInstances( "nda_receiver_address", res_get_receiver_address );

	const nda_hash = await NonDisclosureAgreement_backend.return_hash( document.getElementsByName( "nda" )[ 0 ].innerText );
	console.log( "nda hash is: " + nda_hash.toString() );
	replaceInstances( "nda_hash", nda_hash );

	return false;
});
