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

