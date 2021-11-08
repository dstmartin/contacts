var db = new Dexie("ContactsDB");
db.version(4).stores({
    contacts: '++ID, first_name, last_name, home_phone, cell_phone, work_phone, email, timestamp'
});

db.open().catch(function (e) {
    console.error("Open failed: " + e.stack);
})

getAllContacts();

function getAllContacts() {
    return db.transaction('r', [db.contacts], async () => {
        const contacts = await db.contacts.toArray();
        console.log(contacts);
        displayContacts(contacts);
    });
}

function displayContacts(contacts) {
    let listHTML = "";
    let listStart;
    let listEnd;
    let startAvatar;
    let endAvatar;
    let endDetails;

    listStart = '<li><div class="relative px-6 py-5 flex items-center space-x-3 hover:bg-gray-50 focus-within:ring-2 focus-within:ring-inset focus-within:ring-pink-500">';

    startAvatar = '<span class="inline-flex items-center justify-center h-10 w-10 rounded-full bg-gray-500">';
    startAvatar += '<span class="font-medium leading-none text-white">';
    endAvatar = '</span></span>';

    endDetails = '</p></a>'

    listEnd = '</div></li>';

    for (let i = 0; i < contacts.length; i++) {
        let contact = contacts[i];
        let initials = contact.first_name.charAt(0) + contact.last_name.charAt(0);
        let fullName = contact.first_name + ' ' + contact.last_name;

        let startDetails = '<a href="show.html?id=' + contact.ID + '" class="focus:outline-none">';
        startDetails += '<span class="absolute inset-0" aria-hidden="true"></span>';
        startDetails += '<p class="text-sm font-medium text-gray-900">';

        // listHTML += listStart + startAvatar + initials + endAvatar + startDetails(contact.ID) + fullName + endDetails + listEnd;
        listHTML += listStart + startAvatar + initials + endAvatar + startDetails + fullName + endDetails + listEnd;
    }

    document.getElementById('contacts').innerHTML = listHTML;    
}

function addContact(firstName, lastName, homePhone, cellPhone, workPhone, email) {
    let contact = { 
        first_name: firstName, 
        last_name: lastName,
        home_phone: homePhone,
        cell_phone: cellPhone,
        work_phone: workPhone,
        email: email,
        timestamp: new Date().getTime() 
    };

    db.contacts.put(contact).then (function(){
        //
        // Then when data is stored, read from it
        //
        // return db.contacts.get('Nicolas');
        getAllContacts();
        console.log("New contact added");
    }).catch(function(error) {
       //
       // Finally don't forget to catch any error
       // that could have happened anywhere in the
       // code blocks above.
       //
       alert ("Error: " + error);
    });
}

function submitContact() {
    let firstName = document.getElementById('first-name');
    let lastName = document.getElementById('last-name');
    let homePhone = document.getElementById('home-phone');
    let cellPhone = document.getElementById('cell-phone');
    let workPhone = document.getElementById('work-phone');
    let email = document.getElementById('email');

    addContact(
        firstName.value, 
        lastName.value, 
        homePhone.value, 
        cellPhone.value, 
        workPhone.value, 
        email.value
    );
}
