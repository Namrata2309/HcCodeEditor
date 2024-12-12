const editor = CodeMirror(document.getElementById("editor"), {
    mode: "htmlmixed", // Default mode
    lineNumbers: true,
});

document.getElementById("language-select").addEventListener("change", (e) => {
    const language = e.target.value;
    editor.setOption("mode", language);
});

function runCode() {
    console.log("Running code...");
    if (typeof Sk === "undefined") {
        console.error("Skulpt is not loaded.");
        return;
    }

    const code = editor.getValue();
    const outputElement = document.getElementById("output");
    outputElement.textContent = ""; // Clear previous output

    const language = document.getElementById("language-select").value;

    if (language === "python") {
        Sk.configure({
            output: (text) => (outputElement.textContent += text),
            read: (filename) => {
                if (!Sk.builtinFiles || !Sk.builtinFiles["files"][filename]) {
                    throw new Error("File not found: " + filename);
                }
                return Sk.builtinFiles["files"][filename];
            },
        });

        Sk.misceval
            .asyncToPromise(() => Sk.importMainWithBody("<stdin>", false, code))
            .catch((error) => {
                outputElement.textContent = "Error: " + error.message;
            });
    } else {
        outputElement.textContent = "Non-Python language execution...";
    }
}
const customMenu = document.getElementById("contextMenu");
const pulse = document.getElementById('pulse');

// Function to show the custom context menu
function showContextMenu(event) {
  event.preventDefault();
  let menuX = event.clientX;
  let menuY = event.clientY;

  if (menuX > window.innerWidth - 220) {
    menuX -= 220;
  }
  customMenu.style.left = `${menuX}px`;
  customMenu.style.top = `${menuY}px`;
  customMenu.style.transformOrigin = 'top left';

  pulse.style.left = `${menuX - 10}px`;
  pulse.style.top = `${menuY - 10}px`;
  pulse.classList.add('active');
  setTimeout(() => pulse.classList.remove('active'), 300);

  customMenu.classList.add('visible');
}

// Event listener to handle right-click for context menu
document.addEventListener("contextmenu", (event) => {
  event.preventDefault();
  if (event.target.tagName === "INPUT" || event.target.tagName === "TEXTAREA") {
    showContextMenu(event);
  } else {
    showContextMenu(event);
  }
});

// Event listener to hide context menu on click
document.addEventListener("click", () => {
  customMenu.classList.remove('visible');
});

// Event listener to hide context menu on pressing 'Escape'
document.addEventListener("keydown", (event) => {
  if (event.key === "Escape") {
    customMenu.classList.remove('visible');
  }
});



