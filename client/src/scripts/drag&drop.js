function drag(event) {
    event.dataTransfer.setData
        ('target_id', event.target.id);
    console.log("drag")

}

function allowDrop(event) {
    event.preventDefault();
    console.log("allowDrop")
}

function drop(event) {
    event.preventDefault();
    console.log("drop")

    var drop_target;
    if(event.target.className !== "col-4"){
        drop_target = event.target.closest(".col-4");
    }
    else{
        drop_target = event.target;
    }

    var drag_target_id = event.dataTransfer.getData('target_id');
    var drag_target = document.getElementById(drag_target_id);
    var tmp = drag_target.outerHTML;
    drag_target.outerHTML = drop_target.outerHTML;
    drop_target.outerHTML = tmp;
}

export {drag, drop, allowDrop}