export {Room, Site, getSites, getRooms, renderSites, loadSites, clearCache, renderSelectedRooms}

const ROOMS_URL = 'https://dartagnan.cg.helmo.be/~p150107/js2/rooms/rooms.php';

class Room {

    constructor({room, roomTypeCode, nbrPlaces}) {
        this.room = room;
        this.roomTypeCode = roomTypeCode;
        this.nbrPlaces = nbrPlaces;
    }

    get typeRoom() {
        switch (this.roomTypeCode) {
            case 'A': return "Auditoire";
            case 'C': return "Classe";
            case 'I': return "Laboratoire informatique";
            case 'L': return "Laboratoire";
            case 'P': return "Salle polyvalente";
            default: return "Non spécifié";
        }
    }
}

class Site {

    constructor({siteCode, siteName, rooms} =[]) {
        this.siteCode= siteCode;
        this.siteName= siteName;
        this.rooms = rooms.map(item => new Room(item));
    }

    pushRooms(...rooms) {
        let nbrAddedRooms = 0;
        for (let room of rooms) {
            let exists = this.rooms.find(item => item.room === room.room)
            if (exists) {
                continue;
            }

            nbrAddedRooms++;
            this.rooms.push(room);
        }
        return nbrAddedRooms;
    }

    removeRoom(roomName) {
        let currentRoom = this.rooms.find(item => item.room === roomName);
        if (currentRoom) {
            let index = this.rooms.indexOf(currentRoom);
            this.rooms.splice(index, 1);
            return true;
        } else {
            return false;
        }
    }
}

function getSites() {
    return new Promise((resolve, reject) => {
        fetch(`${ROOMS_URL}`)
            .then(response => {
                if (!response.ok){
                    throw new Error(`[${response.status}]: ${response.statusText}`);
                }
                return response.json();
            })
            .then(result => {
                let sites = result.map(item => new Site(item));
                resolve(sites);
            })
            .catch(error => reject(error));
    });
}

function getRooms() {
    return getSites()
        .then(sites => {
            let requests = sites.map(site => {
                return fetch(`${ROOMS_URL}`, { method: "POST", body: JSON.stringify({siteCode: site.siteCode}) })
                    .then(response => {
                        if(!response.ok) {
                            throw new Error('Erreur HTTP POST:'+ response.status);
                        }
                        return response.json();
                    })
                    .then(rooms => {
                        site.rooms = rooms.map(item => new Room(item));
                        return site;
                    })
            });
            return Promise.all(requests);
        }).catch(error => {
            console.error("Erreur HTTP:" + error.message);
            return [];
        });
}

function renderSites(sites) {
    let sitesSection = document.getElementById('sites');
    sitesSection.innerHTML = '';

    sites.sort((a, b) => a.siteName.localeCompare(b.siteName));

    sites.forEach((site, index) => {
       site.rooms.sort((a, b) => {
           if (a.nbrPlaces === b.nbrPlaces) {
               return a.room.localeCompare(b.room);
           }
           return a.nbrPlaces = b.nbrPlaces;
       });

        let detailsElement = document.createElement('details');
        detailsElement.id = site.siteCode;

        let previousStorage = sessionStorage.getItem('OPENED');
        if (index === 0 && previousStorage === null) {
            sessionStorage.setItem('OPENED', site.siteCode);
        }

        let summaryElement = document.createElement('summary');
        summaryElement.textContent = site.siteName;

        let ulElement = document.createElement('ul');

        renderRooms(site, ulElement);

        detailsElement.appendChild(summaryElement);
        detailsElement.appendChild(ulElement);

        sitesSection.appendChild(detailsElement);

        detailsElement.addEventListener('click', () => {
            let siteCode = sessionStorage.getItem('OPENED');

            let lastOpened = document.getElementById(siteCode);

            if (siteCode !== detailsElement.id) {
                lastOpened.removeAttribute('open');
            } else {
                event.preventDefault();
            }
            sessionStorage.setItem('OPENED', site.siteCode);
        })
    });

    openSite();
}

function renderSelectedRooms(site) {
    renderRooms()
}

function openSite() {
    let id = sessionStorage.getItem('OPENED');
    let element = document.getElementById(id);
    element.setAttribute('open', '');
}

function renderRooms(site, ulElement) {
    site.rooms.forEach(room => {
        let liElement = document.createElement('li');
        liElement.textContent = `${room.room} (${room.nbrPlaces})`;

        liElement.addEventListener('mouseover', () => {
            liElement.classList.add('active');
        });

        liElement.addEventListener('mouseout', () => {
            liElement.classList.remove('active');
        });

        ulElement.appendChild(liElement);
    });
}

function loadSites() {
    let save = localStorage.getItem('SITES');
    if (save === null) {
        getRooms().then(sites => {
           localStorage.setItem('SITES', JSON.stringify(sites));
        });
        return getRooms();
    }

    return new Promise((resolve) => {
       let sites = JSON.parse(save).map(site => {
           return new Site(site);
       });
       resolve(sites);
    });
}

function clearCache() {
    localStorage.clear();
    sessionStorage.clear();
}
