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
    
    return db.transaction('r', [db.contacts], async () => {
        id = parseInt(id);
        const contact = await db.contacts.get(id);

        const fullName = contact.first_name + ' ' + contact.last_name;
        var date = new Date(contact.timestamp);
        const month = date.toLocaleString('default', { month: 'long' });
        var formattedDate = month + ' ' + date.getDate() + ', ' + date.getFullYear();

        document.getElementById('contact-name').innerHTML = fullName;
        
        if (contact.home_phone)
            document.getElementById('home-phone').innerHTML = contact.home_phone;

        if (contact.cell_phone)
            document.getElementById('cell-phone').innerHTML = contact.cell_phone;

        if (contact.work_phone)
            document.getElementById('work-phone').innerHTML = contact.work_phone;

        if (contact.email)
            document.getElementById('email').innerHTML = contact.email;
        
        document.getElementById('date-added').innerHTML = formattedDate;

        var editBtn = document.getElementById("edit-contact");
        var att = document.createAttribute("href");
        att.value = 'edit.html?id=' + contact.ID;
        editBtn.setAttributeNode(att);
    });
}

function deleteContact() {
    key = parseInt(getID);
    db.contacts.delete(key).then(function () {
        console.log("Contact deleted");
        window.location.replace("index.html");
    }).catch(function (error) {
        console.error("Error: " + error);
    });
}

if (getID)
    getContactByID(getID);
else
    // Need an ID before we show any user details
    // TODO: Check if ID exists and also redirect if not
    window.location.replace("index.html");

