// foxywm.js
import defaults from './foxywm.config.json' assert { type: 'json' };
import 'https://code.jquery.com/jquery-3.7.1.js';
import 'https://code.jquery.com/ui/1.13.3/jquery-ui.js';
var onEnter = function () { }
var onClose = function () { }
var onLeave = function () { }
var css = document.createElement("link")
css.rel = "stylesheet"
css.href = "https://code.jquery.com/ui/1.13.3/themes/base/jquery-ui.css"
document.head.appendChild(css)
document.addEventListener("mousemove", handleMouseMove);
window.aWindowIsDagggin = false
window.maximisedWin = ""
window.lastWin = {}
function handleMouseMove(event) {
  window.x = event.pageX;
  window.y = event.pageY;
}
export default function foxyWM() {
  console.log(defaults);

  window.wm = {
    windows: {
      new: function nw(content, title, id, instant = false) {
        if (document.querySelector("#" + id) == null) {
          const win = document.createElement("wmcontent");
          win.innerHTML = content;
          win.title = title
          win.dataset.title = title;
          win.id = id;
          document.body.appendChild(win);
          if (instant) {
            wm.windows.show(id);
          }
          win.parentElement.addEventListener("mouseleave", onLeave)
          return win;
        }
        
      },
      show: function show(id) {
        $('[aria-describedby="' + id + '"]').fadeIn();
        $("#" + id).dialog({ close: alert })
        $("#" + id).on('dialogclose', function (event) {
          console.log(event.target)
          wm.windows.close(event.target.id)
        });
        $("#" + id)[0].previousElementSibling.onclick = wm.windows.unmax
        document.querySelector("#" + id).parentElement.onmouseenter = function (e) {
          console.log(e.target.children)
          window.lastWin = { "el": e.target, "id": e.target.getAttribute("aria-describedby") }
          onEnter()
        };
      },
      close: function close(id, destroy = true) {
        $('[aria-describedby="' + id + '"]').hide();
        if (destroy) { wm.windows.destroy(id) }
        onClose()
      },
      destroy: function destroy(id) {
        $('[aria-describedby="' + id + '"]').fadeOut();
        $('[aria-describedby="' + id + '"]').remove();
        $('#' + id).remove();
      },
      default: function def(id) {
        wm.windows.new(defaults[id].content, defaults[id].title, id, true);
      },
      maximise: function max(id) {
        $('[aria-describedby="' + id + '"]')[0].style.top = "40px"
        $('[aria-describedby="' + id + '"]')[0].style.left = "0px"
        window.maximisedWin = id
        $('[aria-describedby="' + id + '"]')[0].style.width = "calc(100vw - calc(5.333px * 3))"
        $('[aria-describedby="' + id + '"]')[0].style.height = "calc(100vh - calc(1.2em + 100px))"
      },
      unmax: function unmax(e) {

        console.log(e.target.id)
        if (e.target.id = window.maximisedWin) {
          window.maximisedWin = ""
          console.log(e)
          window.aWindowIsDagggin = true
          e.target.parentElement.parentElement.style.width = "300px"
          e.target.parentElement.parentElement.style.height = "500px"
          e.target.parentElement.onmousemove = function () {
            e.target.parentElement.parentElement.style.top = `${y}px`
            e.target.parentElement.parentElement.style.left = `${x}px`
            e.target.parentElement.parentElement.onmouseleave = function () { e.target.parentElement.onmousemove = "" }
          }
        }
      },
      getName: function getName(id) {
        if (id == "fwm.current") {
          console.log(lastWin)
          return document.querySelector("[aria-describedby='" + lastWin.id + "'] wmcontent").dataset.title
        } else {
          return document.querySelector("#" + id).dataset.title
        }
      },
      setName: function setName(id, name) {
        if (id == "fwm.current") {
          console.log(lastWin)
          document.querySelector("[aria-describedby='" + lastWin.id + "'] wmcontent").dataset.title = name
          document.querySelector("[aria-describedby='" + lastWin.id + "'] wmcontent").childeren[0].innerText = name

        } else {
          document.querySelector("[aria-describedby='" + id + "'] wmcontent").dataset.title = name
          document.querySelector("[aria-describedby='" + id + "'] wmcontent").childeren[0].innerText = name
        }
      }
    },
    events: {
      setOnEnter: function soe(func) {
        onEnter = func;
      },
      setOnClose: function soc(func) {
        onClose = func;
      },
      setOnLeave: function sol(func) {
        onLeave = func;
      }
    }
  }
};

foxyWM()