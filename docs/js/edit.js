var db = new Dexie("ContactsDB");
db.version(4).stores({
    contacts: '++ID, first_name, last_name, timestamp'
});

db.open().catch(function (e) {
    console.error("Open failed: " + e.stack);
})

const urlParams = new URLSearchParams(window.location.search);
const getID = urlParams.get('id');

function getContactByID(id) {
    console.log(getID);

    return db.transaction('r', [db.contacts], async () => {
        id = parseInt(id);
        const contact = await db.contacts.get(id);

        const fullName = contact.first_name + ' ' + contact.last_name;
        var date = new Date(contact.timestamp);
        const month = date.toLocaleString('default', { month: 'long' });
        var formattedDate = month + ' ' + date.getDate() + ', ' + date.getFullYear();

        // The fields are required and will be present
        document.getElementById('first-name').value = contact.first_name;
        document.getElementById('last-name').value = contact.last_name;

        // The fields are not always present and need a conditional
        if (contact.home_phone)
            document.getElementById('home-phone').value = contact.home_phone;

        if (contact.cell_phone)
            document.getElementById('cell-phone').value = contact.cell_phone;

        if (contact.work_phone)
            document.getElementById('work-phone').value = contact.work_phone;

        if (contact.email)
            document.getElementById('email').value = contact.email;
    });
}

function updateContact(id, firstName, lastName, homePhone, cellPhone, workPhone, email) {
    id = parseInt(id);
    
    let contact = { 
        first_name: firstName, 
        last_name: lastName,
        home_phone: homePhone,
        cell_phone: cellPhone,
        work_phone: workPhone,
        email: email,
        timestamp: new Date().getTime() 
    };
    
    db.contacts.update(id, contact).then(function (updated) {
        if (updated) {
            window.location.replace("show.html?id=" + getID);
        }
        else {
          console.log ("There was a problem updating the contact");
          window.location.replace("show.html?id=" + getID);
        }
    });
}

function submitContact() {
    let firstName = document.getElementById('first-name');
    let lastName = document.getElementById('last-name');
    let homePhone = document.getElementById('home-phone');
    let cellPhone = document.getElementById('cell-phone');
    let workPhone = document.getElementById('work-phone');
    let email = document.getElementById('email');

    updateContact(
        getID,
        firstName.value, 
        lastName.value, 
        homePhone.value, 
        cellPhone.value, 
        workPhone.value, 
        email.value
    );
}

if (getID)
    getContactByID(getID);
else
    // Need an ID before we show any user details
    // TODO: Check if ID exists and also redirect if not
    window.location.replace("index.html");

