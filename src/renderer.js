const PDFFILE = "../img/before.pdf"
function dataURItoBinArray(data) {
  // taken from: https://stackoverflow.com/a/11954337/14699733
  var binary = atob(data);
  var array = [];
  for (var i = 0; i < binary.length; i++) {
    array.push(binary.charCodeAt(i));
  }
  return new Uint8Array(array);
}

/** Function to load a PDF file using the input=file API */
document.querySelector("#opendoc").addEventListener("change", function (e) {
  let file = e.target;
  let reader = new FileReader();
  reader.onload = async function () {
    await pdfViewer.loadDocument({
      data: dataURItoBinArray(reader.result.replace(/^data:.*;base64,/, ""))
    });
    await pdfThumbnails
      .loadDocument({
        data: dataURItoBinArray(reader.result.replace(/^data:.*;base64,/, ""))
      })
      .then(() => pdfThumbnails.setZoom("fit"));
  };
  if (file.files.length > 0) {
    reader.readAsDataURL(file.files[0]);
    // document.querySelector("#filedownload").download = document.querySelector(
    //   "#opendoc"
    // ).files[0].name;
  }
});
/** Sets the document in horizontal scroll by changing the class for the pages container and refreshing the document
 *    so that the pages may be displayed in horizontal scroll if they were not visible before */
function setHorizontal() {
  document.querySelector(".maindoc").classList.add("horizontal-scroll");
  pdfViewer.refreshAll();
}

/** Toggles the visibility of the thumbnails */
function togglethumbs(el) {
  if (el.classList.contains("pushed")) {
    el.classList.remove("pushed");
    document.querySelector(".thumbnails").classList.add("hide");
  } else {
    el.classList.add("pushed");
    document.querySelector(".thumbnails").classList.remove("hide");
  }
}
/** Toggles hiding the current page */
// function hideselected() {
//   let $selected = pdfThumbnails.$container.find(".selected");
//   let i = $selected.data("page");
//   $selected.toggleClass("hidden");
//   pdfViewer.$container
//     .find('.pdfpage[data-page="' + i + '"]')
//     .toggleClass("hidden");
//   pdfViewer.scrollToPage(i);
// }
/** Now create the PDFjsViewer object in the DIV */
let pdfViewer = new PDFjsViewer($(".maindoc"), {
  zoomValues: [0.5, 0.75, 1, 1.25, 1.5, 2, 3, 4],
  visibleThreshold: 0.5,
  extraPagesToLoad: 5,
  /** Update the zoom value in the toolbar */
  onZoomChange: function (zoom) {
    zoom = parseInt(zoom * 10000) / 100;
    $(".zoomval").text(zoom + "%");
  },

  /** Update the active page */
  onActivePageChanged: function (page) {
    let pageno = $(page).data("page");
    let pagetotal = this.getPageCount();

    if (!$(page).hasClass("hidden")) {
      pdfThumbnails.setActivePage(pageno);
      $("#pageno").val(pageno);
      $("#pageno").attr("max", pagetotal);
      $("#pagecount").text("of " + pagetotal);
    }
  },

  /** zoom to fit when the document is loaded and create the object if wanted to be downloaded */
  onDocumentReady: function () {
    pdfViewer.setZoom("fit");
    // pdfViewer.pdf.getData().then(function (data) {
    //   document.querySelector("#filedownload").href = URL.createObjectURL(
    //     new Blob([data], { type: "application/pdf" })
    //   );
    //   document.querySelector("#filedownload").target = "_blank";
    // });
  }
});

/** Load the initial PDF file */
pdfViewer.loadDocument(PDFFILE).then(function () {
//   document.querySelector("#filedownload").download = PDFFILE;
});

/** Create the thumbnails */
let pdfThumbnails = new PDFjsViewer($(".thumbnails"), {
  zoomFillArea: 0.7,
  extraPagesToLoad: 3,
  onNewPage: function (page, i) {
    $('<div class="numbering">').text(i).appendTo(page);
	console.log("New thumbnail page")
    page.on("click", function () {
      pdfThumbnails.setActivePage(page.data("page"));
      if (!pdfViewer.isPageVisible(page.data("page"))) {
        pdfViewer.scrollToPage(page.data("page"));
      }
    });
  },
  onDocumentReady: function () {
    this.setZoom("fit");
  }
});

pdfThumbnails.setActivePage = function (pageno) {
  this.$container.find(".pdfpage").removeClass("selected");

  let $npage = this.$container
    .find('.pdfpage[data-page="' + pageno + '"]')
    .addClass("selected");
//   $("#hideselected").removeClass("pushed");
//   if ($npage.hasClass("hidden")) $("#hideselected").addClass("pushed");

  if (!this.isPageVisible(pageno)) {
    this.scrollToPage(pageno);
  }
}.bind(pdfThumbnails);

pdfThumbnails.loadDocument(PDFFILE).then(e=>{
	document.querySelectorAll(".thumbnails .pdfpage").forEach(el=>{
		el.addEventListener("click",e=>{
			let id = el.id
			let number = parseInt(id.split("-")[1])
			pdfViewer.scrollToPage(number); return false;
		})
	})
})

