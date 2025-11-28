// DOM Elements
const jsonInput = document.getElementById('jsonInput');
const jsonOutput = document.getElementById('jsonOutput');
const prettifyBtn = document.getElementById('prettifyBtn');
const minifyBtn = document.getElementById('minifyBtn');
const validateBtn = document.getElementById('validateBtn');
const copyBtn = document.getElementById('copyBtn');
const clearBtn = document.getElementById('clearBtn');
const errorMessage = document.getElementById('errorMessage');

// Utility Functions
function showError(message) {
    errorMessage.textContent = message;
    errorMessage.classList.add('show');
    jsonInput.classList.add('error');
}

function hideError() {
    errorMessage.classList.remove('show');
    jsonInput.classList.remove('error');
}

function parseJSON(input) {
    try {
        const parsed = JSON.parse(input);
        hideError();
        return { success: true, data: parsed };
    } catch (error) {
        const match = error.message.match(/position (\d+)/);
        const position = match ? match[1] : 'unknown';
        showError(`Invalid JSON: ${error.message}`);
        return { success: false, error: error.message };
    }
}

function syntaxHighlight(json) {
    json = json.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
    
    return json.replace(
        /("(\\u[a-zA-Z0-9]{4}|\\[^u]|[^\\"])*"(\s*:)?|\b(true|false|null)\b|-?\d+(?:\.\d*)?(?:[eE][+\-]?\d+)?)/g,
        function (match) {
            let cls = 'json-number';
            
            if (/^"/.test(match)) {
                if (/:$/.test(match)) {
                    cls = 'json-key';
                } else {
                    cls = 'json-string';
                }
            } else if (/true|false/.test(match)) {
                cls = 'json-boolean';
            } else if (/null/.test(match)) {
                cls = 'json-null';
            }
            
            return '<span class="' + cls + '">' + match + '</span>';
        }
    );
}

// Core Functions
function prettifyJSON() {
    const input = jsonInput.value.trim();
    
    if (!input) {
        showError('Please enter some JSON to prettify');
        return;
    }
    
    const result = parseJSON(input);
    
    if (result.success) {
        const formatted = JSON.stringify(result.data, null, 2);
        jsonOutput.innerHTML = syntaxHighlight(formatted);
    }
}

function minifyJSON() {
    const input = jsonInput.value.trim();
    
    if (!input) {
        showError('Please enter some JSON to minify');
        return;
    }
    
    const result = parseJSON(input);
    
    if (result.success) {
        const minified = JSON.stringify(result.data);
        jsonOutput.innerHTML = syntaxHighlight(minified);
    }
}

function validateJSON() {
    const input = jsonInput.value.trim();
    
    if (!input) {
        showError('Please enter some JSON to validate');
        return;
    }
    
    const result = parseJSON(input);
    
    if (result.success) {
        jsonOutput.innerHTML = '<span class="json-boolean" style="color: var(--success); font-size: 1.2rem;">✓ Valid JSON</span>\n\n' + 
                               syntaxHighlight(JSON.stringify(result.data, null, 2));
    }
}

function copyToClipboard() {
    const text = jsonOutput.textContent;
    
    if (!text) {
        showError('Nothing to copy. Please format some JSON first.');
        return;
    }
    
    navigator.clipboard.writeText(text).then(() => {
        copyBtn.classList.add('copied');
        
        setTimeout(() => {
            copyBtn.classList.remove('copied');
        }, 2000);
    }).catch(err => {
        showError('Failed to copy to clipboard');
    });
}

function clearInput() {
    jsonInput.value = '';
    jsonOutput.innerHTML = '';
    hideError();
}

// Event Listeners
prettifyBtn.addEventListener('click', prettifyJSON);
minifyBtn.addEventListener('click', minifyJSON);
validateBtn.addEventListener('click', validateJSON);
copyBtn.addEventListener('click', copyToClipboard);
clearBtn.addEventListener('click', clearInput);

// Clear error on input
jsonInput.addEventListener('input', () => {
    if (jsonInput.classList.contains('error')) {
        hideError();
    }
});

// Keyboard shortcuts
document.addEventListener('keydown', (e) => {
    // Ctrl/Cmd + Enter to prettify
    if ((e.ctrlKey || e.metaKey) && e.key === 'Enter') {
        e.preventDefault();
        prettifyJSON();
    }
    
    // Ctrl/Cmd + Shift + M to minify
    if ((e.ctrlKey || e.metaKey) && e.shiftKey && e.key === 'M') {
        e.preventDefault();
        minifyJSON();
    }
});

// Sample JSON for demo (optional - remove if not needed)
const sampleJSON = {
    "name": "JSON Linter",
    "version": "1.0.0",
    "features": ["prettify", "minify", "validate"],
    "darkMode": true,
    "count": 42
};

// Uncomment to load sample on page load
// jsonInput.value = JSON.stringify(sampleJSON);
