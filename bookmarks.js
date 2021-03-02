/**
 * SyncMarks
 *
 * @version 1.3.7
 * @author Offerel
 * @copyright Copyright (c) 2021, Offerel
 * @license GNU General Public License, version 3
 */
document.addEventListener("DOMContentLoaded", function() {
	if(document.getElementById("uf")) document.getElementById("uf").focus();
	if(document.getElementById('loginbody')) {
		document.getElementById('hmenu').classList.add('inlogin1');
		document.querySelector('#menu button').classList.add('inlogin2');
	}
	if(document.getElementById('bookmarks')) {
		document.querySelector('#menu input').addEventListener('keyup', function(e) {
			var sfilter = this.value;
			var allmarks = document.querySelectorAll('#bookmarks li.file');
			var bdiv = document.getElementById('bookmarks');
			bdiv.innerHTML = '';
			allmarks.forEach(bookmark => {
				bdiv.appendChild(bookmark);
				if(bookmark.innerText.toUpperCase().includes(sfilter.toUpperCase()) || bookmark.firstChild.attributes.href.nodeValue.toUpperCase().includes(sfilter.toUpperCase())) {
					bookmark.style.display = 'block';
					bookmark.style.paddingLeft = '20px';
				} else {
					bookmark.style.display = 'none';
				}
			});
			if((sfilter == "") || (e.keyCode == 27)) {
				bdiv.innerHTML = document.getElementById('hmarks').innerHTML;
				document.querySelector('#menu input').value = '';
			}
		});

		document.querySelector('#menu button').addEventListener('click', function() {
			if(document.querySelector('#menu button').innerHTML == '\u00D7') {
				document.querySelector('#menu input').blur();
				document.querySelector('#menu button').innerHTML = '\u2315';
				document.querySelector('#menu button').classList.remove('asform');
				document.querySelector('#menu input').classList.remove('asform');
				document.querySelector('#menu input').classList.add('isform');
				document.getElementById('mprofile').style.display = 'block';
			}
			else {
				document.querySelector('#menu button').innerHTML = '\u00D7';
				document.querySelector('#menu button').classList.add('asform');
				document.querySelector('#menu input').classList.remove('isform');
				document.querySelector('#menu input').classList.add('asform');
				document.getElementById('mprofile').style.display = 'none';
				document.querySelector('#menu input').focus();
			}
			hideMenu();
		});

		if(document.getElementById("logfile")) {
			document.getElementById("logfile").addEventListener("mousedown", function(e){
				if (e.offsetX < 3) {
					document.addEventListener("mousemove", resize, false);
				}
			}, false);
		}
		
		document.addEventListener("mouseup", function(){
			document.removeEventListener("mousemove", resize, false);
		}, false);
		var draggable;
		document.querySelectorAll('.file').forEach(function(bookmark){
			bookmark.addEventListener('contextmenu',onContextMenu,false);
			bookmark.addEventListener('dragstart', function(event){
				event.target.style.opacity = '.3';
				event.dataTransfer.effectAllowed = "move";
			});
			bookmark.addEventListener('dragend', function(event){
				event.target.style.opacity = '';
			});
		});
		document.querySelectorAll('.folder').forEach(bookmark => bookmark.addEventListener('contextmenu',onContextMenu,false));

		document.querySelectorAll('.lbl').forEach(function(folder) {
			folder.addEventListener('dragover', function(event){
				event.preventDefault();
				event.dataTransfer.dropEffect = "move"
			});
			folder.addEventListener('dragenter', function(){		
				this.style = 'background-color: lightblue;';
			});
			folder.addEventListener('dragleave', function(){		
				this.style = 'background-color: unset;';
			});
			folder.addEventListener('drop', function(event){
				event.preventDefault();
				movBookmark(event.target.htmlFor.substring(2), draggable.target.id);
				event.target.style = 'background-color: unset;';
			});
		});
		document.addEventListener("drag", function(event) {
			draggable = event;
		});

		document.querySelectorAll('.tablinks').forEach(tab => tab.addEventListener('click',openMessages, false));
		document.querySelectorAll('.NotiTableCell .fa-trash').forEach(message => message.addEventListener('click',delMessage, false));
		document.querySelector('#cnoti').addEventListener('change',eNoti,false);

		if(sessionStorage.getItem('gNoti') != 1) getNotifications();

		document.addEventListener('keydown', e => {
			if (e.keyCode === 27) {
				hideMenu();
			}
		});

		document.querySelector("#mngcform input[type='text']").addEventListener('focus', function() {
			this.select();
		});

		document.getElementById("save").addEventListener('click', function(event) {
			event.preventDefault();
			hideMenu();
			let folder = document.getElementById('folder').value;
			let url = encodeURIComponent(document.getElementById('url').value);
			var xhr = new XMLHttpRequest();
			var data = "caction=madd&folder=" + folder + "&url=" + url;
			xhr.onreadystatechange = function () {
				if (this.readyState == 4) {
					if(this.status == 200) {
						document.getElementById('bookmarks').innerHTML = this.responseText;
						console.log("Bookmark added successfully.");
						document.querySelectorAll('.file').forEach(bookmark => bookmark.addEventListener('contextmenu',onContextMenu,false));
						document.querySelectorAll('.folder').forEach(bookmark => bookmark.addEventListener('contextmenu',onContextMenu,false));
					} else {
						alert("Error adding bookmark, please check server log.");
					}
				}
			};
			xhr.open("POST", document.location.href, true);
			xhr.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
			xhr.send(data);
		});

		if(document.getElementById('userSelect')) document.getElementById('userSelect').addEventListener('change', function() {
			if(this.value > 0) {
				document.getElementById('nuser').value = document.querySelector('#userSelect option:checked').text;
				checkuform();
				document.getElementById('muadd').value = 'Edit User';
				document.getElementById('mudel').disabled = false;
			}
		});

		if(document.getElementById('npwd')) document.getElementById('npwd').addEventListener('input', function() {checkuform()});
		if(document.getElementById('nuser')) document.getElementById('nuser').addEventListener('input', function() {checkuform()});
		if(document.getElementById('userLevel')) document.getElementById('userLevel').addEventListener('input', function() {checkuform()});

		document.getElementById('hmenu').addEventListener('click', function() {
			var mainmenu = document.getElementById('mainmenu');
			if(document.querySelector('#bookmarks')) document.querySelector('#bookmarks').addEventListener('click', hideMenu, false);
			if(mainmenu.style.display === 'block') {
				mainmenu.style.display = 'none';
			} else {
				hideMenu();
				mainmenu.style.display = 'block';
			}
		});

		if(document.getElementById('mngusers')) document.getElementById('mngusers').addEventListener('click', function() {
			hideMenu();
			document.getElementById('mnguform').style.display = 'block';
			document.querySelector('#bookmarks').addEventListener('click',hideMenu, false);
		});

		document.getElementById('muser').addEventListener('click', function(e) {
			e.preventDefault();
			hideMenu();
			document.getElementById('userform').style.display = 'block';
			document.querySelector('#bookmarks').addEventListener('click',hideMenu, false);
		});

		document.querySelectorAll('.mdcancel').forEach(button => button.addEventListener('click', function() {
			hideMenu();
		}));

		document.getElementById('mpassword').addEventListener('click', function() {
			hideMenu();
			document.getElementById('passwordform').style.display = 'block';
			document.querySelector('#bookmarks').addEventListener('click',hideMenu, false);
		});

		document.getElementById('pbullet').addEventListener('click', function() {
			hideMenu();
			document.getElementById('pbulletform').style.display = 'block';
			document.querySelector('#bookmarks').addEventListener('click',hideMenu, false);
		});

		document.getElementById('nmessages').addEventListener('click', function() {
			hideMenu();
			document.getElementById('nmessagesform').style.display = 'block';
			document.querySelector('#bookmarks').addEventListener('click',hideMenu, false);
		});

		document.getElementById('clientedt').addEventListener('click', function() {
			hideMenu();
			document.getElementById('mngcform').style.display = 'block';
			document.querySelector('#bookmarks').addEventListener('click',hideMenu, false);
		});

		document.getElementById('psettings').addEventListener('click', function() {
			hideMenu();
			document.getElementById('mngsform').style.display = 'block';
			document.querySelector('#bookmarks').addEventListener('click',hideMenu, false);
		});

		document.getElementById('duplicates').addEventListener('click', function() {
			hideMenu();
			let loader = document.createElement('div');
			loader.classList.add('db-spinner');
			loader.id = 'db-spinner';
			document.querySelector('body').appendChild(loader);
			var xhr = new XMLHttpRequest();
			var data = "caction=checkdups";
			xhr.onreadystatechange = function () {
				if(this.readyState == 4) {
					if(this.status == 200) {
						let dubData = JSON.parse(this.responseText);
						if(dubData.length > 0) {
							let dubDIV = document.createElement('div');
							let head = document.createElement('h6');
							head.innerText = dubData.length + ' duplicates found';
							let hspan = document.createElement('span');
							hspan.innerText = 'Click on a entry to delete the duplicate';
							dubDIV.id = 'dubDIV';
							dubDIV.classList.add('mbmdialog');
							dubDIV.appendChild(head);
							dubDIV.appendChild(hspan);
							document.querySelector('body').appendChild(dubDIV);
							let dubMenu = document.createElement('ul');
							dubMenu.id = 'dubMenu';
							dubData.forEach(function(dubURL){
								let dubSub = document.createElement('ul');
								dubSub.classList.add('dubSub');
								let dubLi = document.createElement('li');
								dubLi.id = 'dub_' + dubURL.bmID;
								dubLi.innerText = dubURL.bmTitle;
								dubLi.dataset.url = dubURL.bmURL;
								dubLi.title = dubURL.bmURL;
								dubURL.subs.forEach(function(subEntry){
									let subLi = document.createElement('li');
									subLi.classList.add('menuitem');
									subLi.innerText = subEntry.bmTitle;
									subLi.dataset.bmid = subEntry.bmID;
									subLi.addEventListener('click', function(){
										let xhrDel = new XMLHttpRequest();
										let dub = this;
										let delData = "caction=mdel&rc=1&id="+dub.dataset.bmid;
										let loader = document.createElement('div');
										loader.classList.add('db-spinner');
										loader.id = 'db-spinner';
										document.querySelector('body').appendChild(loader);
										xhrDel.open("POST", document.location.href, true);
										xhrDel.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
										xhrDel.addEventListener('load', function(event){
											if(xhrDel.status >= 200 && xhrDel.status < 300) {
												dub.style.display = 'none';
												document.getElementById(dub.dataset.bmid).parentNode.remove();
												document.getElementById('db-spinner').remove();
											}
										});
										xhrDel.send(delData);
									});
									let subSp = document.createElement('span');
									subSp.innerHTML = subEntry.fway;
									subSp.title = subSp.innerHTML;
									subLi.appendChild(subSp);
									dubSub.appendChild(subLi);
								});
								dubLi.appendChild(dubSub);
								dubMenu.appendChild(dubLi);
								dubDIV.appendChild(dubMenu);
								dubDIV.style.display = 'block';
							});
							document.getElementById('db-spinner').remove();
						} else {
							alert('No duplicates found');
						}
					} else {
						alert("Error checking for duplicates, please check server log.");
					}
				}
			};

			xhr.open("POST", document.location.href, true);
			xhr.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
			xhr.send(data);
			
			return false;
		});
		
		document.getElementById('bexport').addEventListener('click', function() {
			hideMenu();
			var today = new Date();
			var dd = today.getDate();
			var mm = today.getMonth()+1; 
			var yyyy = today.getFullYear();
			if(dd<10) dd='0'+dd;
			if(mm<10) mm='0'+mm;
			today = dd+'-'+mm+'-'+yyyy;

			var xhr = new XMLHttpRequest();
			var data = "caction=fexport&type=html";

			xhr.onreadystatechange = function () {
				if (this.readyState == 4) {
					if(this.status == 200) {
						var blob = new Blob([this.responseText], { type: 'text/html' });
						var link = document.createElement('a');
						link.href = window.URL.createObjectURL(blob);
						link.download = "bookmarks_" + today + ".html";
						link.click();
						console.log("HTML successfully, please look in your download folder.");
					} else {
						alert("Error generating export, please check server log.");
					}
				}
			};

			xhr.open("POST", document.location.href, true);
			xhr.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
			xhr.send(data);

			return false;
		});

		document.getElementById('footer').addEventListener('click', function() {
			hideMenu();
			document.querySelector('#bookmarks').addEventListener('click',hideMenu, false);
			document.getElementById('bmarkadd').style.display = 'block';
			url.focus();
			url.addEventListener('input', enableSave);
		});

		if(document.getElementById('mlog')) document.getElementById('mlog').addEventListener('click', function() {
			hideMenu();
			let logfile = document.getElementById('logfile');
			if(logfile.style.visibility === 'visible') {
				logfile.style.visibility = 'hidden';
				document.getElementById('close').style.visibility = 'hidden';
			} else {
				logfile.style.visibility = 'visible';
				document.getElementById('close').style.visibility = 'visible';
				let xhr = new XMLHttpRequest();
				let data = "caction=mlog";
				xhr.onreadystatechange = function () {
					if (this.readyState == 4) {
						if(this.status == 200) {
							document.getElementById('lfiletext').innerHTML = this.responseText;
							moveEnd();
						} else {
							alert("Error loading logfile, please check server log.");
						}
					}
				};
				xhr.open("POST", document.location.href, true);
				xhr.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
				xhr.send(data);
			}
		});

		if(document.getElementById('mclear')) document.getElementById('mclear').addEventListener('click', function() {
			let logfile = document.getElementById('logfile');
			if(logfile.style.visibility === 'visible') {
				logfile.style.visibility = 'hidden';
				document.getElementById('close').style.visibility = 'hidden';
				let xhr = new XMLHttpRequest();
				let data = "caction=mclear";
				xhr.onreadystatechange = function () {
					if (this.readyState == 4) {
						if(this.status == 200) {
							console.log("Logfile should now be empty.");
						} else {
							console.log("Error couldnt clear logfile.");
						}
					}
				};
				xhr.open("POST", document.location.href, true);
				xhr.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
				xhr.send(data);
			}
		});
		
		if(document.getElementById('mclose')) document.getElementById('mclose').addEventListener('click', function() {
			if(document.getElementById('logfile').style.visibility === 'visible') {
				document.getElementById('logfile').style.visibility = 'hidden';
				document.getElementById('close').style.visibility = 'hidden';
			}
		}); 

		document.querySelectorAll('#mngcform .clientname').forEach(function(e) {
			e.addEventListener('touchstart',function() {
				this.children[0].style.display = 'block';
			})
		});

		document.querySelectorAll("#mngcform li div.rename").forEach(function(element) {element.addEventListener('click', mvClient, false)});
		document.querySelectorAll("#mngcform li div.remove").forEach(function(element) {element.addEventListener('click', delClient, false)});

		document.querySelectorAll("#mngcform li div.clientname input").forEach(function(element) {
			element.addEventListener('mouseleave', function() {
				if(this.defaultValue != this.value) {
					this.style.display = 'block';
					this.parentElement.parentElement.children[2].classList.add('renamea');
					this.parentElement.parentElement.children[1].classList.add('renamea');
					this.parentElement.parentElement.children[1].classList.remove('rename');
					this.parentElement.parentElement.children[2].classList.remove('remove');
				}
			});
		});

		document.getElementById('fname').addEventListener('input', function() {
			document.getElementById('fsave').disabled = false;
		});

		document.getElementById('edtitle').addEventListener('input', function() {
			document.getElementById('edsave').disabled = false;
		});

		document.getElementById('edurl').addEventListener('input', function() {
			document.getElementById('edsave').disabled = false;
		});

		document.getElementById('mvfolder').addEventListener('change', function() {
			document.getElementById('mvsave').disabled = false;
		});

		document.getElementById('fsave').addEventListener('click', function(e) {
			e.preventDefault();
			let xhr = new XMLHttpRequest();
			let data = 'caction=cfolder&fname=' + document.getElementById('fname').value + '&fbid=' + document.getElementById('fbid').value;
			
			xhr.onreadystatechange = function () {
				if (this.readyState == 4) {
					if(this.status == 200) {
						if(this.responseText == 1)
							location.reload(false);
						else
							console.log("There was a problem adding the new folder."); 
					}
				}
			};

			xhr.open("POST", document.location.href, true);
			xhr.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
			xhr.send(data);
			hideMenu();
			return false;
		});

		document.getElementById('edsave').addEventListener('click', function(e) {
			e.preventDefault();
			let xhr = new XMLHttpRequest();
			let data = 'caction=bmedt&title=' + document.getElementById('edtitle').value + '&url=' + document.getElementById('edurl').value + '&id=' + document.getElementById('edid').value;
			xhr.onreadystatechange = function () {
				if (this.readyState == 4) {
					if(this.status == 200) {
						if(this.responseText == 1)
							location.reload(false);
						else
							console.log("There was a problem changing that bookmark.");
					}
				}
			};
			xhr.open("POST", document.location.href, true);
			xhr.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
			xhr.send(data);
			return false;
		});
		
		document.getElementById('mvsave').addEventListener('click', function(e) {
			e.preventDefault();
			movBookmark(document.getElementById('mvfolder').value, document.getElementById('mvid').value);
			document.getElementById('bmamove').style.display = 'none';
		});
	}
}, false);

function movBookmark(folderID, bookmarkID) {
	let data = 'caction=bmmv&folder='+folderID+'&id='+bookmarkID;
	let xhr = new XMLHttpRequest();
	xhr.onreadystatechange = function () {
		if (this.readyState == 4) {
			if(this.status == 200) {
				if(this.responseText == 1) {
					let obm = document.getElementById(bookmarkID).parentElement;
					let nfolder = document.getElementById('f_'+folderID);
					obm.remove();
					nfolder.lastChild.appendChild(obm);
				} else
					alert("There was a problem moving that bookmark.");
			}
		}
	};
	xhr.open("POST", document.location.href, true);
	xhr.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
	xhr.send(data);
}

function delClient(element) {
	let xhr = new XMLHttpRequest();
	let data = 'caction=adel&cido=' + element.target.parentElement.id;
	xhr.onreadystatechange = function () {
		if (xhr.readyState == 4) {
			if(xhr.status == 200) {
				document.getElementById('mngcform').innerHTML = xhr.responseText;
				document.querySelectorAll("#mngcform li div.remove").forEach(function(element) {element.addEventListener('click', delClient, false)});
				document.querySelectorAll("#mngcform li div.rename").forEach(function(element) {element.addEventListener('click', mvClient, false)});
			}
		}
	};
	xhr.open("POST", document.location.href, true);
	xhr.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
	xhr.send(data);
}

function mvClient(element) {
	let xhr = new XMLHttpRequest();
	let data = 'caction=arename&cido=' + element.target.parentElement.id + '&nname=' + element.target.parentElement.children[0].children['cname'].value;
	xhr.onreadystatechange = function () {
		if (xhr.readyState == 4) {
			if(xhr.status == 200) {
				document.getElementById('mngcform').innerHTML = xhr.responseText;
				document.querySelectorAll("#mngcform li div.remove").forEach(function(element) {element.addEventListener('click', delClient, false)});
				document.querySelectorAll("#mngcform li div.rename").forEach(function(element) {element.addEventListener('click', mvClient, false)});
			}
		}
	};
	xhr.open("POST", document.location.href, true);
	xhr.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
	xhr.send(data);
}

function resize(e){
	let wdt = window.innerWidth - parseInt(e.x);
	document.getElementById("logfile").style.width = wdt + "px";
}

function checkuform() {
	if(document.getElementById('nuser').value.length > 0 && document.getElementById('npwd').value.length > 0 && document.getElementById('userLevel').value.length > 0) {
		document.getElementById('muadd').disabled = false;
		document.getElementById('mudel').disabled = false;
	}
	else {
		document.getElementById('muadd').disabled = true;
		document.getElementById('mudel').disabled = true;
	}
	
	if(document.getElementById('userSelect').value.length < 1) {
		document.getElementById('mudel').disabled = true;
	}
}

function moveEnd () {
	let lfiletext = document.getElementById("lfiletext");
	lfiletext.scrollTop = lfiletext.scrollHeight;
}

function delBookmark(id, title) {
	if(confirm("Would you like to delete \"" + title + "\"?")) {
		let xhr = new XMLHttpRequest();
		let data = 'caction=mdel&id=' + id;

		let loader = document.createElement('div');
		loader.classList.add('db-spinner');
		loader.id = 'db-spinner';
		document.querySelector('body').appendChild(loader);

		xhr.onreadystatechange = function () {
			if (this.readyState == 4) {
				document.getElementById('db-spinner').remove();
				if(this.status == 200) {
					hideMenu();
					document.getElementById(id).parentNode.remove();
				}
				else
					console.log("There was a problem removing that bookmark.");
			}
		};
		xhr.open("POST", document.location.href, true);
		xhr.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
		xhr.send(data);
	}
}

function enableSave() {
	if(document.getElementById('url').value.length > 7)
		document.getElementById('save').disabled = false;
	else
		document.getElementById('save').disabled = true;
}

function showMenu(x, y){
	var menu = document.querySelector('.menu');
	var minbot = window.innerHeight - 120;
	if(y >= minbot) y = minbot;
    menu.style.left = x + 'px';
	menu.style.top = y + 'px';
	menu.style.opacity = 1;
    menu.classList.add('show-menu');
}

function hideMenu(){
	let menu = document.querySelector('.menu');
	menu.classList.remove('show-menu');
	menu.style.display = 'none';
	document.querySelectorAll('.mmenu').forEach(function(item) {item.style.display = 'none'});
	document.querySelectorAll('.mbmdialog').forEach(function(item) {item.style.display = 'none'});
	if(document.getElementById('dubDIV')) document.querySelector('body').removeChild(document.getElementById('dubDIV'));
}

function onContextMenu(e){
    e.preventDefault();
	hideMenu();
	let menu = document.querySelector('.menu');
	menu.style.display = 'block';
	if(e.target.attributes.id){
		document.getElementById('bmid').value = e.target.attributes.id.value;
		document.getElementById('bmid').title = e.target.attributes.title.value;
		document.getElementById('btnMove').setAttribute('style','display:block !important');
		document.getElementById('btnFolder').setAttribute('style','display:block !important');
	} else {
		document.getElementById('bmid').value = e.target.nextElementSibling.value
		document.getElementById('bmid').title = e.target.textContent
		document.getElementById('btnMove').setAttribute('style','display:none !important');
		document.getElementById('btnFolder').setAttribute('style','display:none !important');
	}

	showMenu(e.pageX, e.pageY);
	document.querySelector('#btnEdit').addEventListener('click', onClick, false);
	document.querySelector('#btnMove').addEventListener('click', onClick, false);
	document.querySelector('#btnDelete').addEventListener('click', onClick, false);
	document.querySelector('#btnFolder').addEventListener('click', onClick, false);
}

function onClick(e){
	var minleft = 155;
	var minbot = window.innerHeight - 200;
	var xpos = e.pageX;
	var ypos = e.pageY;
	if(xpos <= minleft) xpos = minleft;
	if(ypos >= minbot) ypos = minbot;
	
	switch(this.id) {
		case 'btnEdit':
			document.getElementById('edtitle').value = document.getElementById('bmid').title;
			document.getElementById('edid').value = document.getElementById('bmid').value;

			if(document.getElementById(document.getElementById('bmid').value)) {
				document.getElementById('edurl').value = document.getElementById(document.getElementById('bmid').value).href;
				document.getElementById('bmarkedt').firstChild.innerText = 'Edit Bookmark';
				document.getElementById('edurl').type = 'text';
			} else {
				document.getElementById('edurl').value = '';
				document.getElementById('edurl').type = 'hidden';
				document.getElementById('bmarkedt').firstChild.innerText = 'Edit Folder';
			}
			
			hideMenu();
			document.getElementById('bmarkedt').style.left = xpos;
			document.getElementById('bmarkedt').style.top = ypos;
			document.getElementById('bmarkedt').style.display = 'block';
			break;
		case 'btnMove':
			document.getElementById('mvtitle').value = document.getElementById('bmid').title;
			document.getElementById('mvid').value = document.getElementById('bmid').value;
			hideMenu();
			document.getElementById('bmamove').style.left = xpos;
			document.getElementById('bmamove').style.top = ypos;
			document.getElementById('bmamove').style.display = 'block';
			break;
		case 'btnDelete':
			delBookmark(document.getElementById('bmid').value, document.getElementById('bmid').title);
			break;
		case 'btnFolder':
			hideMenu();
			document.getElementById('folderf').style.left = xpos;
			document.getElementById('folderf').style.top = ypos;
			document.getElementById('folderf').style.display = 'block';
			document.getElementById('fbid').value = document.getElementById('bmid').value;
			break;
		default:
			break;
	}

    document.removeEventListener('click', onClick);
}

function openMessages(element) {
	var i, tabcontent, tablinks;
	tabcontent = document.getElementsByClassName("tabcontent");
	for (i = 0; i < tabcontent.length; i++) {
		tabcontent[i].style.display = "none";
	}
	
	tablinks = document.getElementsByClassName("tablinks");
	for (i = 0; i < tablinks.length; i++) {
		tablinks[i].className = tablinks[i].className.replace(" active", "");
	}

	document.getElementById(element.target.dataset['val']).style.display = "block";
	element.currentTarget.className += " active";
}

function delMessage(message) {
	let loop = message.target.parentElement.parentElement.parentElement.parentElement.parentElement.id;
	let xhr = new XMLHttpRequest();
	let data = 'caction=rmessage&lp=' + loop + '&message=' + message.target.dataset['message'];
	xhr.onreadystatechange = function () {
		if (this.readyState == 4) {
			if(this.status == 200) {
				document.querySelector('#'+loop+' .NotiTable .NotiTableBody').innerHTML = this.responseText;
				document.querySelectorAll('.NotiTableCell .fa-trash').forEach(function(element) {element.addEventListener('click', delMessage, false)});
			}
		}
	};
	xhr.open("POST", document.location.href, true);
	xhr.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
	xhr.send(data);
}

function eNoti(e) {
	var nval = e.target.checked;
	if(nval) {
		if (!("Notification" in window)) {
			alert("This browser does not support desktop notification");
			setOption("notifications",0);
		}
		else if (Notification.permission === "granted") {
			var notification = new Notification("Syncmarks", {
				body: "Notifications will be enabled for Syncmarks.",
				icon: './images/bookmarks192.png'
			});
			setOption("notifications",1);
		}
		else if (Notification.permission !== "denied") {
			Notification.requestPermission().then(function (permission) {
				if (permission === "granted") {
					var notification = new Notification("Syncmarks", {
						body: "Notifications will be enabled for Syncmarks.",
						icon: './images/bookmarks192.png'
					});
					setOption("notifications",1);
				}
			});
		}
	} else {
		setOption("notifications",0);
	}
}

function setOption(option,val) {
	let xhr = new XMLHttpRequest();
	let data = 'caction=soption&option=' + option + '&value=' + val;
	xhr.onreadystatechange = function () {
		if (this.readyState == 4) {
			if(this.status == 200) {
				if(this.responseText === "1") {
					console.log("Option saved.");
				} else {
					alert("Error saving option, please check server log");
				}
			}
		}
	};
	xhr.open("POST", document.location.href, true);
	xhr.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
	xhr.send(data);
}

function rNot(noti) {
	let xhr = new XMLHttpRequest();
	let data = 'caction=durl&durl=' + noti;
	xhr.onreadystatechange = function () {
		if (this.readyState == 4) {
			if(this.status == 200) {
				if(this.responseText === "1") {
					console.log("Notification removed");
				} else {
					alert("Problem removing notification, please check server log.");
				}
			}
		}
	};
	xhr.open("POST", document.location.href, true);
	xhr.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
	xhr.send(data);
}

function show_noti(noti) {
	if (Notification.permission !== 'granted')
		Notification.requestPermission();
	else {
		let notification = new Notification(noti.title, {
			body: noti.url,
			icon: './images/bookmarks192.png',
			requireInteraction: true
		});
		
		notification.onclick = function() {
			window.open(noti.url);
			rNot(noti.nkey);
		};
	}
}

function getNotifications() {
	let xhr = new XMLHttpRequest();
	let data = 'caction=gurls';

	xhr.onreadystatechange = function () {
		if (this.readyState == 4) {
			if(this.status == 200) {
				if(this.responseText) {
					let notifications = JSON.parse(this.responseText);
					if(notifications[0]['nOption'] == 1) {
						notifications.forEach(function(notification){
							show_noti(notification);
						});
					}
				}
			}
		}
	};

	xhr.open("POST", document.location.href, true);
	xhr.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');
	xhr.send(data);

	sessionStorage.setItem('gNoti', '1');
}