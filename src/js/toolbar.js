$("#zoomin").click(e=>{
	pdfViewer.setZoom("in")
})

$("#zoomout").click(e=>{
	pdfViewer.setZoom("out")
})

$("#fitzoom").click(e=>{
	pdfViewer.setZoom("fit")
})
$("#heightzoom").click(e=>{
	pdfViewer.setZoom("height")
})
$("#widthzoom").click(e=>{
	pdfViewer.setZoom("width")
})

document.getElementById("toggle-thumbs").addEventListener("click",e=>{
    let el = document.getElementById("toggle-thumbs")
    if (el.classList.contains("pushed")) {
        el.classList.remove("pushed");
        document.querySelector(".thumbnails").classList.add("hide");
    } else {
        el.classList.add("pushed");
        document.querySelector(".thumbnails").classList.remove("hide");
    }
})

$("#hideselected").click(e=>{
    let $selected = pdfThumbnails.$container.find(".selected");
    let i = $selected.data("page");
    $selected.toggleClass("hidden");
    pdfViewer.$container
        .find('.pdfpage[data-page="' + i + '"]')
        .toggleClass("hidden");
    pdfViewer.scrollToPage(i);
})

function zoom(by){
	pdfViewer.setZoom(by); 
	return false;
}

$("#50-zoom").click(e=>{
	zoom(0.5)
})
$("#75-zoom").click(e=>{
	zoom(0.75)
})
$("#100-zoom").click(e=>{
	zoom(1.0)
})
$("#125-zoom").click(e=>{
	zoom(1.25)
})

$("#150-zoom").click(e=>{
	zoom(1.5)
})
$("#200-zoom").click(e=>{
	zoom(2.0)
})
$("#300-zoom").click(e=>{
	zoom(3.0)
})

document.getElementById("pageno").addEventListener("change",e=>{
    pdfViewer.scrollToPage(parseInt(document.getElementById("pageno").value))
})

$("#page-up").click(e=>{
    pdfViewer.prev()
})

$("#page-down").click(e=>{
    pdfViewer.next()
})

$("#scroll-to-first").click(e=>{
    pdfViewer.scrollToPage(1); return false;
})

$("#scroll-to-last").click(e=>{
    pdfViewer.scrollToPage(pdfViewer.pdf.numPages); return false;
})

$("#rotate-90-anticlockwise").click(e=>{
    pdfViewer.rotate(-90, true); pdfThumbnails.rotate(-90, true).then(() => pdfThumbnails.setZoom("fit"));
})

$("#rotate-90-clockwise").click(e=>{
    pdfViewer.rotate(90, true); pdfThumbnails.rotate(90, true).then(() => pdfThumbnails.setZoom("fit"));
})

$("#sign-with-dropbox").click(e=>{
    $("#sign-with-dropbox").toggleClass("pushed")
    $(".sidebar").toggleClass("hide")
    setTimeout(function(){
        $(".is-loading").toggleClass("is-loading")
        $(".spinner-border-sm").hide()
        $("#summary").val("This is a Cleaning Service Contract that requires your signature, please sign it and send it back at your earliest convenience.")
    },1500)
})

$("#pre-process").click(e=>{
    const PDFFILE = "../img/after.pdf"
    setTimeout(function(){
        pdfViewer.loadDocument(PDFFILE).then(e=>{
            pdfThumbnails
            .loadDocument(PDFFILE)
            .then(() => pdfThumbnails.setZoom("fit"));
        })
    },500)
})

$("#submit").click(e=>{
    $(".sidebar").toggleClass("hide")
    setTimeout(function(){
        alert("Sent Signature Request")
    },1000)
    
})