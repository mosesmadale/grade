$('.submit-button')[0].onmousedown = e => {
    $('.submit-button').css('border-bottom', 'none')
}

$('.submit-button')[0].onmouseup = e => {
    $('.submit-button').css('border-bottom', 'solid rgb(6, 6, 71) 5px')
}
$('.submit-button')[0].onmouseout = e => {
    $('.submit-button').css('border-bottom', 'solid rgb(6, 6, 71) 5px')
}

$('.plus')[0].onmousedown = e => {
    $('.plus').css('border-bottom', 'none')
}

$('.plus')[0].onmouseup = e => {
    $('.plus').css('border-bottom', 'solid rgb(73, 36, 5) 5px')
}
$('.plus')[0].onmouseout = e => {
    $('.plus').css('border-bottom', 'solid rgb(73, 36, 5) 5px')
}

//$('.edit-button')[0].click(handleModifications)

document.querySelectorAll('.edit-button').forEach(e => {
    e.onclick = handleModifications;
})


let safety = true;

$('.plus').click(function() {
    if (safety) {
        $('.subject-input-container')[0].innerHTML += `
                <div class="special2">
                    <div class="subject-name">
                        <div class="subtitle-super-small">Subject</div>
                        <input type="text" class="subject-name-id" placeholder="E.g. English">
                    </div>
                    <div class="percentage">
                        <div class="subtitle-super-small">Percentage</div>
                        <input type="number" class="percentage-id" placeholder="E.g. 45">
                    </div>
                    <div class="grade">
                        <div class="subtitle-super-small">Grade</div>
                        <input type="text" class="grade-id" placeholder="E.g. A*">
                    </div>
                    <div class="edit-button">Save</div>
                </div>
    `;
        safety = false;
        document.querySelectorAll('.edit-button').forEach(e => {
            e.onclick = handleModifications;
        })
    } else {
        document.querySelector('.popup-for-message-2').style.display = 'block';
        setTimeout(() => {
            document.querySelector('.popup-for-message-2').style.display = 'none';
        }, 2000)
    }
})



function handleModifications() {
    if ($(this)[0].textContent == 'Save') {
        $(this)[0].parentElement.outerHTML = `<div class="special">
        <div class="subject-name">${$(this)[0].parentElement.firstElementChild.lastElementChild.value}</div>
        <div class="grades"><span>${$(this)[0].parentElement.children[1].lastElementChild.value}</span>% - <span>${$(this)[0].parentElement.children[2].lastElementChild.value}</span></div>
        <div class="edit-button">Edit</div>
    </div>`;
        safety = true;
    } else if ($(this)[0].textContent == 'Edit') {
        $(this)[0].parentElement.outerHTML = `
                <div class="special2">
                    <div class="subject-name">
                        <div class="subtitle-super-small">Subject</div>
                        <input type="text" class="subject-name-id" placeholder="E.g. English" value="${$(this)[0].parentElement.children[0].textContent}">
                    </div>
                    <div class="percentage">
                        <div class="subtitle-super-small">Percentage</div>
                        <input type="number" class="percentage-id" placeholder="E.g. 45" value="${$(this)[0].parentElement.children[1].firstElementChild.textContent}">
                    </div>
                    <div class="grade">
                        <div class="subtitle-super-small">Grade</div>
                        <input type="text" class="grade-id" placeholder="E.g. A*" value="${$(this)[0].parentElement.children[1].lastElementChild.textContent}">
                    </div>
                    <div class="edit-button">Save</div>
                </div>
        `;
        safety = false;
    }
    document.querySelectorAll('.edit-button').forEach(e => {
        e.onclick = handleModifications;
    })

}

//produce button can only be pressed if everything is saved

document.querySelector('.submit-button').onclick = function() {
    if (safety && document.querySelector('#candidate-name').value != '' && document.querySelector('#candidate-number-input').value != '') {
        collectInfo();
        document.querySelector('#overlay').style.display = 'block';
        document.querySelector('.print-button').onclick = function() {
            displayOnPdf()
        }
        document.querySelector('.save-button').onclick = function() {
            displayOnPdf()
        }
    } else {
        document.querySelector('.popup-for-message').style.display = 'block';
        setTimeout(() => {
            document.querySelector('.popup-for-message').style.display = 'none';
        }, 2000)

    }
}

let allInfo = {};

function collectInfo() {
    allInfo['name'] = document.querySelector('#candidate-name').value;
    allInfo['number'] = document.querySelector('#candidate-number-input').value;
    allInfo['subjects'] = [];
    document.querySelectorAll('.special').forEach(e => {
        let subject = e.children[0].textContent;
        subject == '' ? subject = '-' : null;
        let percentage = e.children[1].children[0].textContent;
        percentage == '' ? percentage = '-' : null;
        let grade = e.children[1].children[1].textContent;
        grade == '' ? grade = '-' : null;
        allInfo['subjects'].push({ subject: subject, percentage: percentage, grade: grade });
    })

}

function displayOnPdf() {

    // Default export is a4 paper, portrait, using millimeters for units
    const doc = new jsPDF();

    let w = 210 / 100;
    let h = 297 / 100;
    //top square for logo - isamilo logo

    function demoImages() {
        // Because of security restrictions, getImageFromUrl will
        // not load images from other domains.  Chrome has added
        // security restrictions that prevent it from loading images
        // when running local files.  Run with: chromium --allow-file-access-from-files --allow-file-access
        // to temporarily get around this issue.
        var getImageFromUrl = function(url, callback) {
            var img = new Image(),
                data, ret = {
                    data: null,
                    pending: true
                };

            img.onError = function() {
                throw new Error('Cannot load image: "' + url + '"');
            };
            img.onload = function() {
                var canvas = document.createElement('canvas');
                document.body.appendChild(canvas);
                canvas.width = img.width;
                canvas.height = img.height;

                var ctx = canvas.getContext('2d');
                ctx.drawImage(img, 0, 0);
                // Grab the image as a jpeg encoded in base64, but only the data
                data = canvas.toDataURL('image/jpeg').slice('data:image/jpeg;base64,'.length);
                // Convert the data to binary form
                data = atob(data);
                document.body.removeChild(canvas);

                ret['data'] = data;
                ret['pending'] = false;
                if (typeof callback === 'function') {
                    callback(data);
                }
            };
            img.src = url;

            return ret;
        };

        // Since images are loaded asyncronously, we must wait to create
        // the pdf until we actually have the image data.
        // If we already had the jpeg image binary data loaded into
        // a string, we create the pdf without delay.
        var createPDF = function(imgData) {

            doc.addImage(imgData, 'JPEG', w + 13, w + 7, w * 15, w * 15);
            doc.save(`${allInfo['name']} - ${allInfo['number']}.pdf`);

        }

        getImageFromUrl('logo.jpg', createPDF);
    }

    demoImages();




    //text below logo
    doc.setFontSize(10)
    doc.text(w + 7, w * 15 + 15, 'Isamilo International School')
        //text for main title
    doc.setFontSize(25)
    doc.setTextColor(4, 4, 44)
    doc.text(w * 20 + 20, w * 10 + 5, '2021 IGCSE Mock Results')
        //horizontal line
    doc.setLineWidth(0.1);
    doc.setDrawColor(4, 4, 44)
        //candidate-details
    doc.setFontSize(16)
    doc.text(w + 10, w * 23 + 10, `${allInfo['name']} - ${allInfo['number']}`);
    doc.setLineWidth(0.05);
    doc.line(w + 10, w * 25 + 10, (w * 100) - 10, w * 25 + 10);

    //adding the top column for the labels
    doc.setFontSize(14);
    doc.setFont("times");
    doc.setFontStyle('bold')
    doc.text(w + 10, w * 33 + 10, 'Subject')
    doc.text(w * 60, w * 33 + 10, 'Percentage')
    doc.text(w * 80, w * 33 + 10, 'Grade')
    doc.setFontStyle('normal')
    doc.line(w + 10, w * 34 + 10, (w * 100) - 10, w * 34 + 10);



    doc.setLineWidth(0.01);
    let n = 40;
    allInfo['subjects'].forEach((e, i) => {
        doc.setFontSize(12)
        doc.setFont("sans-serif");
        doc.text(w + 10, w * (n + (i * 7)) + 10, `${allInfo['subjects'][i]['subject']}`)
        doc.text(w * 60, w * (n + (i * 7)) + 10, `${allInfo['subjects'][i]['percentage']}`)
        doc.text(w * 80, w * (n + (i * 7)) + 10, `${allInfo['subjects'][i]['grade']}`)
        doc.line(w + 10, w * (n + 1 + (i * 7)) + 10, (w * 100) - 10, w * (n + 1 + (i * 7)) + 10);
    })

    //adding signatures

    doc.text(w + 10, (h * 100) - 25, 'Student');
    doc.line(w + 10, (h * 100) - 23, w + 60, (h * 100) - 23);
    doc.text(w * 50, (h * 100) - 25, 'Teacher');
    doc.line(w * 50, (h * 100) - 23, (w * 50) + 50, (h * 100) - 23);




}