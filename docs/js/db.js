let db;
let dbReq = indexedDB.open('Contacts', 1);

if (!('indexedDB' in window)) {
    console.log('This browser doesn\'t support IndexedDB');
}

dbReq.onupgradeneeded = function (event) {
    // Set the db variable to our database  
    db = event.target.result;

    let contacts = db.createObjectStore('contacts', { autoIncrement: true });
}
dbReq.onsuccess = function (event) {
    db = event.target.result;
    getContacts(db);
}
dbReq.onerror = function (event) {
    alert('Error opening database: ' + event.target.errorCode);
}

function getContacts(db) {
    let tx = db.transaction(['contacts'], 'readonly');
    let store = tx.objectStore('contacts');
    
    // Get all items from store
    let req = store.openCursor();
    let allContacts = [];

    req.onsuccess = function (event) {
        let cursor = event.target.result;

        if (cursor != null) {
            allContacts.push(cursor.value);
            cursor.continue();
        } else {
            displayContacts(allContacts);
        }
    }
    req.onerror = function (event) {
        alert('Error in cursor request: ' + event.target.errorCode);
    }
}

function displayContacts(contacts) {
    // Display contacts to the screen
    // TODO: refactor
    let listHTML = '<ul role="list" class="relative z-0 divide-y divide-gray-200">';
    let listStart;
    let listEnd;
    let startAvatar;
    let endAvatar;
    let startDetails;
    let endDetails;

    listStart = '<li><div class="relative px-6 py-5 flex items-center space-x-3 hover:bg-gray-50 focus-within:ring-2 focus-within:ring-inset focus-within:ring-pink-500">';
    
    startAvatar = '<span class="inline-flex items-center justify-center h-10 w-10 rounded-full bg-gray-500">';
    startAvatar += '<span class="font-medium leading-none text-white">';
    endAvatar = '</span></span>';

    startDetails = '<a href="#" class="focus:outline-none">';
    startDetails += '<span class="absolute inset-0" aria-hidden="true"></span>';
    startDetails += '<p class="text-sm font-medium text-gray-900">';
    endDetails = '</p></a>'

    listEnd = '</div></li>';

    for (let i = 0; i < contacts.length; i++) {
        let contact = contacts[i];
        let initials = contact.first_name.charAt(0) + contact.last_name.charAt(0);
        let fullName = contact.first_name + ' ' + contact.last_name;
        
        listHTML += listStart + startAvatar + initials + endAvatar + startDetails + fullName + endDetails + listEnd;
    }
    document.getElementById('contacts').innerHTML = listHTML;
}

function addContact(db, firstName, lastName) {
    let tx = db.transaction(['contacts'], 'readwrite');
    let store = tx.objectStore('contacts');

    // Put the contact in the store
    let contact = { first_name: firstName, last_name: lastName };
    store.add(contact);

    // Wait for the database transaction to complete
    tx.oncomplete = function() { getContacts(db); }
    tx.onerror = function (event) {
        alert('Error storing contact ' + event.target.errorCode);
    }
}

function submitContact() {
    let firstName = document.getElementById('first-name');
    let lastName = document.getElementById('last-name');

    addContact(db, firstName.value, lastName.value);
}
