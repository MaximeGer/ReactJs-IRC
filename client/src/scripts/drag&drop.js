// function drag(event) {
//     console.log(event)
//     event.dataTransfer.setData
//         ('target_id', event.target.id);
//     console.log("drag")

// }

// function allowDrop(event) {
//     event.preventDefault();
// }

// function drop(event) {
//     event.preventDefault();

//     var drop_target;
//     if(event.target.className !== "card"){
//         drop_target = event.target.closest(".card");
//     }
//     else{
//         drop_target = event.target;
//     }
//     console.log(event.dataTransfer.getData('target_id'))
//     var drag_target_id = event.dataTransfer.getData('target_id');
//     var drag_target = document.getElementById(drag_target_id);
//     var tmp = drag_target.outerHTML;
//     drag_target.outerHTML = drop_target.outerHTML;
//     drop_target.outerHTML = tmp;
// }

// export {drag, drop, allowDrop}