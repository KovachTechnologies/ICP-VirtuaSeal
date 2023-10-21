import { Principal } from "@dfinity/principal";
import { virtuaSeal_backend } from "../../declarations/virtuaSeal_backend";

function addDocument() {
	// parent card container 
	var card = document.getElementsByClassName( "container mt-5" )[ 0 ];
	card.innerHTML = "";

	var title = document.createElement( "div" )
	title.innerHTML = "Add Document";

	card.appendChild( title );

	var text_input = document.createElement( "div" );
	text_input.className = "form-group";
	text_input.id = "first_recipient";
	var text_input_label = document.createElement( "label" );
	text_input_label.setAttribute( "for", "recipient" );
	text_input_label.innerHTML = "Recipient";
	var text_input_inner = document.createElement( "input" );
	text_input_inner.className = "form-control";
	text_input_inner.id = "targets";
	text_input_inner.setAttribute( "type", "text" );

	text_input.appendChild( text_input_label );
	text_input.appendChild( text_input_inner );

	card.appendChild( text_input );

	text_input = document.createElement( "div" );
	text_input.className = "form-group";
	text_input.id = "first_copied";
	text_input_label = document.createElement( "label" );
	text_input_label.setAttribute( "for", "copied" );
	text_input_label.innerHTML = "Copied";
	text_input_inner = document.createElement( "input" );
	text_input_inner.className = "form-control";
	text_input_inner.id = "copied";
	text_input_inner.setAttribute( "type", "text" );

	text_input.appendChild( text_input_label );
	text_input.appendChild( text_input_inner );

	card.appendChild( text_input );

	var text_area = document.createElement( "div" );
	text_area.className = "form-group";
	var text_label = document.createElement( "label" );
	text_label.setAttribute( "for", "document_content" );
	text_label.innerHTML = "Document Content";
	var text_area_inner = document.createElement( "textarea" );
	text_area_inner.className = "form-control";
	text_area_inner.id = "document_content";
	text_area_inner.setAttribute( "rows", "5" );

	text_area.appendChild( text_label );
	text_area.appendChild( text_area_inner );

	card.appendChild( text_area );

	var submit_button = document.createElement( "button" );
	submit_button.id = "addDocumentButton";
	submit_button.innerHTML = "Submit";

	card.appendChild( submit_button );
	document.getElementById( "addDocumentButton" ).addEventListener( "click", addDocumentButton );
}

function addTemplate() {
	// parent card container 
	var card = document.getElementsByClassName( "container mt-5" )[ 0 ];
	card.innerHTML = "";

	var title = document.createElement( "div" )
	title.innerHTML = "Add Template";

	card.appendChild( title );

	var text_input = document.createElement( "div" );
	text_input.className = "form-group";
	text_input.id = "first_recipient";

	var text_desc_label = document.createElement( "label" );
	text_desc_label.setAttribute( "for", "description" );
	text_desc_label.innerHTML = "Description";
	var text_desc_inner = document.createElement( "input" );
	text_desc_inner.id = "description";
	text_desc_inner.className = "form-control";
	text_desc_inner.setAttribute( "type", "text" );

	var text_keyw_label = document.createElement( "label" );
	text_keyw_label.setAttribute( "for", "keywords" );
	text_keyw_label.innerHTML = "Keywords";
	var text_keyw_inner = document.createElement( "input" );
	text_keyw_inner.id = "keywords";
	text_keyw_inner.className = "form-control";
	text_keyw_inner.setAttribute( "type", "text" );

	var text_priv_label = document.createElement( "label" );
	text_priv_label.setAttribute( "for", "private" );
	text_priv_label.innerHTML = "Private";
	var text_priv_inner = document.createElement( "input" );
	text_priv_inner.id = "priv";
	text_priv_inner.className = "form-control";
	text_priv_inner.setAttribute( "type", "checkbox" );

	text_input.appendChild( text_desc_label );
	text_input.appendChild( text_desc_inner );
	text_input.appendChild( text_keyw_label );
	text_input.appendChild( text_keyw_inner );
	text_input.appendChild( text_priv_label );
	text_input.appendChild( text_priv_inner );

	card.appendChild( text_input );

	text_input = document.createElement( "div" );
	text_input.className = "form-group";
	text_input.id = "first_copied";
	var text_input_label = document.createElement( "label" );
	text_input_label.setAttribute( "for", "copied" );
	text_input_label.innerHTML = "Copied";
	var text_input_inner = document.createElement( "input" );
	text_input_inner.className = "form-control";
	text_input_inner.id = "copied";
	text_input_inner.setAttribute( "type", "text" );

	text_input.appendChild( text_input_label );
	text_input.appendChild( text_input_inner );

	card.appendChild( text_input );

	var text_area = document.createElement( "div" );
	text_area.className = "form-group";
	var text_label = document.createElement( "label" );
	text_label.setAttribute( "for", "template_content" );
	text_label.innerHTML = "Template Content";
	var text_area_inner = document.createElement( "textarea" );
	text_area_inner.className = "form-control";
	text_area_inner.id = "template_content";
	text_area_inner.setAttribute( "rows", "5" );

	text_area.appendChild( text_label );
	text_area.appendChild( text_area_inner );

	card.appendChild( text_area );

	var submit_button = document.createElement( "button" );
	submit_button.id = "addTemplateButton";
	submit_button.innerHTML = "Submit";

	card.appendChild( submit_button );
	document.getElementById( "addTemplateButton" ).addEventListener( "click", addTemplateButton );
}

function updateDocument() {
	// parent card container 
	var card = document.getElementsByClassName( "container mt-5" )[ 0 ];
	card.innerHTML = "";

	var title = document.createElement( "div" )
	title.innerHTML = "Update Document";

	card.appendChild( title );

	var text_input = document.createElement( "div" );
	text_input.className = "form-group";
	text_input.id = "first_recipient";

	var text_id_label = document.createElement( "label" );
	text_id_label.setAttribute( "for", "document_id" );
	text_id_label.innerHTML = "Document ID";
	var text_id_inner = document.createElement( "input" );
	text_id_inner.id = "document_id";
	text_id_inner.className = "form-control";
	text_id_inner.setAttribute( "type", "text" );

	text_input.appendChild( text_id_label );
	text_input.appendChild( text_id_inner );

	card.appendChild( text_input );

	var text_area = document.createElement( "div" );
	text_area.className = "form-group";
	var text_label = document.createElement( "label" );
	text_label.setAttribute( "for", "document_content" );
	text_label.innerHTML = "Document Content";
	var text_area_inner = document.createElement( "textarea" );
	text_area_inner.className = "form-control";
	text_area_inner.id = "document_content";
	text_area_inner.setAttribute( "rows", "5" );

	text_area.appendChild( text_label );
	text_area.appendChild( text_area_inner );

	card.appendChild( text_area );


	var submit_button = document.createElement( "button" );
	submit_button.id = "updateDocumentButton";
	submit_button.innerHTML = "Submit";

	card.appendChild( submit_button );
	document.getElementById( "updateDocumentButton" ).addEventListener( "click", updateDocumentButton );
}

function updateTemplate() {
	// parent card container 
	var card = document.getElementsByClassName( "container mt-5" )[ 0 ];
	card.innerHTML = "";

	var title = document.createElement( "div" )
	title.innerHTML = "Update Template";

	card.appendChild( title );

	var text_input = document.createElement( "div" );
	text_input.className = "form-group";
	text_input.id = "first_recipient";

	var text_id_label = document.createElement( "label" );
	text_id_label.setAttribute( "for", "template_id" );
	text_id_label.innerHTML = "Template ID";
	var text_id_inner = document.createElement( "input" );
	text_id_inner.id = "template_id";
	text_id_inner.className = "form-control";
	text_id_inner.setAttribute( "type", "text" );

	var text_desc_label = document.createElement( "label" );
	text_desc_label.setAttribute( "for", "description" );
	text_desc_label.innerHTML = "Description";
	var text_desc_inner = document.createElement( "input" );
	text_desc_inner.id = "template_description";
	text_desc_inner.className = "form-control";
	text_desc_inner.setAttribute( "type", "text" );

	var text_keyw_label = document.createElement( "label" );
	text_keyw_label.setAttribute( "for", "keywords" );
	text_keyw_label.innerHTML = "Keywords";
	var text_keyw_inner = document.createElement( "input" );
	text_keyw_inner.id = "template_keywords";
	text_keyw_inner.className = "form-control";
	text_keyw_inner.setAttribute( "type", "text" );

	text_input.appendChild( text_id_label );
	text_input.appendChild( text_id_inner );
	text_input.appendChild( text_desc_label );
	text_input.appendChild( text_desc_inner );
	text_input.appendChild( text_keyw_label );
	text_input.appendChild( text_keyw_inner );

	card.appendChild( text_input );

	var text_area = document.createElement( "div" );
	text_area.className = "form-group";
	var text_label = document.createElement( "label" );
	text_label.setAttribute( "for", "template_content" );
	text_label.innerHTML = "Template Content";
	var text_area_inner = document.createElement( "textarea" );
	text_area_inner.className = "form-control";
	text_area_inner.id = "template_content";
	text_area_inner.setAttribute( "rows", "5" );

	text_area.appendChild( text_label );
	text_area.appendChild( text_area_inner );

	card.appendChild( text_area );


	var submit_button = document.createElement( "button" );
	submit_button.id = "updateTemplateButton";
	submit_button.innerHTML = "Submit";

	card.appendChild( submit_button );
	document.getElementById( "updateTemplateButton" ).addEventListener( "click", updateTemplateButton );
}

async function getDocuments() {
	// parent card container 
	var card = document.getElementsByClassName( "container mt-5" )[ 0 ];
	card.innerHTML = "";

	var title = document.createElement( "div" )
	title.innerHTML = "My Documents";

	card.appendChild( title );

	const res_documents = await virtuaSeal_backend.get_documents();

	for ( var i = 0; i < res_documents.length; i++ ) {
		var temp = document.createElement( "div" );
		temp.innerHTML = JSON.stringify(res_documents[ i ], (_, v) => typeof v === 'bigint' ? v.toString() : v)
		card.appendChild( temp );
	}

}

async function getTemplates() {
	// parent card container 
	var card = document.getElementsByClassName( "container mt-5" )[ 0 ];
	card.innerHTML = "";

	var title = document.createElement( "div" );
	title.innerHTML = "My Templates";

	card.appendChild( title );

	const res_documents = await virtuaSeal_backend.get_templates();
	for ( var i = 0; i < res_documents.length; i++ ) {
		var temp = document.createElement( "div" );
		temp.innerHTML = JSON.stringify(res_documents[ i ], (_, v) => typeof v === 'bigint' ? v.toString() : v)
		card.appendChild( temp );
	}

}

async function getSignatures() {
	// parent card container 
	var card = document.getElementsByClassName( "container mt-5" )[ 0 ];
	card.innerHTML = "";

	var title = document.createElement( "div" )
	title.innerHTML = "Get Signatures by Document";

	card.appendChild( title );

	var text_input = document.createElement( "div" );
	text_input.className = "form-group";
	text_input.id = "first_recipient";

	var text_id_label = document.createElement( "label" );
	text_id_label.setAttribute( "for", "document_id" );
	text_id_label.innerHTML = "Document ID";
	var text_id_inner = document.createElement( "input" );
	text_id_inner.id = "document_id";
	text_id_inner.className = "form-control";
	text_id_inner.setAttribute( "type", "text" );

	text_input.appendChild( text_id_label );
	text_input.appendChild( text_id_inner );

	card.appendChild( text_input );


	var submit_button = document.createElement( "button" );
	submit_button.id = "getSignaturesButton";
	submit_button.innerHTML = "Submit";

	card.appendChild( submit_button );
	document.getElementById( "getSignaturesButton" ).addEventListener( "click", getSignaturesButton );
}

async function signDocument() {
	// parent card container 
	var card = document.getElementsByClassName( "container mt-5" )[ 0 ];
	card.innerHTML = "";

	var title = document.createElement( "div" )
	title.innerHTML = "Sign Document";

	card.appendChild( title );

	var text_input = document.createElement( "div" );
	text_input.className = "form-group";
	text_input.id = "first_recipient";

	var text_id_label = document.createElement( "label" );
	text_id_label.setAttribute( "for", "document_id" );
	text_id_label.innerHTML = "Document ID";
	var text_id_inner = document.createElement( "input" );
	text_id_inner.id = "document_id";
	text_id_inner.className = "form-control";
	text_id_inner.setAttribute( "type", "text" );

	var text_init_label = document.createElement( "label" );
	text_init_label.setAttribute( "for", "initription" );
	text_init_label.innerHTML = "Initials";
	var text_init_inner = document.createElement( "input" );
	text_init_inner.id = "initials";
	text_init_inner.className = "form-control";
	text_init_inner.setAttribute( "type", "text" );

	var text_sign_label = document.createElement( "label" );
	text_sign_label.setAttribute( "for", "signature" );
	text_sign_label.innerHTML = "Signature";
	var text_sign_inner = document.createElement( "input" );
	text_sign_inner.id = "signature";
	text_sign_inner.className = "form-control";
	text_sign_inner.setAttribute( "type", "text" );

	text_input.appendChild( text_id_label );
	text_input.appendChild( text_id_inner );
	text_input.appendChild( text_init_label );
	text_input.appendChild( text_init_inner );
	text_input.appendChild( text_sign_label );
	text_input.appendChild( text_sign_inner );

	card.appendChild( text_input );


	var submit_button = document.createElement( "button" );
	submit_button.id = "signDocumentButton";
	submit_button.innerHTML = "Submit";

	card.appendChild( submit_button );
	document.getElementById( "signDocumentButton" ).addEventListener( "click", signDocumentButton );
}

async function addDocumentButton() {
	const targets = document.getElementById( "targets" ).value.toString();
	const t_array = targets.split( "," ).map( function( x ) { return Principal.fromText( x.trim() ) } );
	const copied = document.getElementById( "copied" ).value.toString();
	const c_array = copied.split( "," ).map( function( x ) { return Principal.fromText( x.trim() ) } );
	const content = document.getElementById( "document_content" ).value.toString();
	const res = await virtuaSeal_backend.add_document( content, t_array, c_array );
}

async function addTemplateButton() {
	const keywords = document.getElementById( "keywords" ).value.toString();
	const k_array = keywords.split( "," ).map( function( x ) { return x.trim() } );
	const copied = document.getElementById( "copied" ).value.toString();
	const c_array = copied.split( "," ).map( function( x ) { return Principal.fromText( x.trim() ) } );
	const description = document.getElementById( "description" ).value.toString();
	const content = document.getElementById( "template_content" ).value.toString();
	const priv = document.getElementById("priv").checked;
	const res = await virtuaSeal_backend.add_template( content, description, k_array, priv, c_array );
}

async function updateDocumentButton() {
	const doc_id = document.getElementById( "document_id" ).value.toString();
	const content = document.getElementById( "document_content" ).value.toString();
	const res = await virtuaSeal_backend.update_document( doc_id, content );
}

async function updateTemplateButton() {
	const temp_id = document.getElementById( "template_id" ).value.toString();
	const content = document.getElementById( "template_content" ).value.toString();
	const description = document.getElementById( "template_description" ).value.toString();
	const keywords = document.getElementById( "template_keywords" ).value.toString();
	const k_array = keywords.split( "," ).map( function( x ) { return x.trim() } );
	const res = await virtuaSeal_backend.update_template( temp_id, content, description, k_array, [] );
}

async function signDocumentButton() {
	const doc_id = document.getElementById( "document_id" ).value.toString();
	const initials = document.getElementById( "initials" ).value.toString();
	const signature = document.getElementById( "signature" ).value.toString();
	const res = await virtuaSeal_backend.add_signature( doc_id, initials, signature );
}

async function getSignaturesButton() {
	// parent card container 
	const document_id = document.getElementById( "document_id" ).value.toString();

	var card = document.getElementsByClassName( "container mt-5" )[ 0 ];
	card.innerHTML = "";

	var title = document.createElement( "div" )
	title.innerHTML = "Signatures";

	card.appendChild( title );

	const res_documents = await virtuaSeal_backend.get_signatures( document_id );

	for ( var i = 0; i < res_documents.length; i++ ) {
		var temp = document.createElement( "div" );
		temp.innerHTML = JSON.stringify(res_documents[ i ], (_, v) => typeof v === 'bigint' ? v.toString() : v)
		card.appendChild( temp );
	}
}

// sections
document.getElementById( "addDocument" ).addEventListener( "click", addDocument );
document.getElementById( "addTemplate" ).addEventListener( "click", addTemplate );
document.getElementById( "updateDocument" ).addEventListener( "click", updateDocument );
document.getElementById( "updateTemplate" ).addEventListener( "click", updateTemplate );
document.getElementById( "getDocuments" ).addEventListener( "click", getDocuments );
document.getElementById( "getTemplates" ).addEventListener( "click", getTemplates );
document.getElementById( "signDocument" ).addEventListener( "click", signDocument );
document.getElementById( "getSignatures" ).addEventListener( "click", getSignatures );
