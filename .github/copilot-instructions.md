# Zero Hour Implementation

Zero Hour Implementation is a Python project template designed for rapid development setup and deployment. This is a minimal project skeleton that provides the foundational structure for Python development with modern tooling and best practices.

**Always reference these instructions first and fallback to search or bash commands only when you encounter unexpected information that does not match the info here.**

## Working Effectively

### Environment Setup
- **Python Version**: Python 3.12.3 is available and working
- **Create virtual environment**: 
  - `python3 -m venv venv` -- takes 3 seconds. NEVER CANCEL.
- **Activate virtual environment**:
  - Linux/Mac: `source venv/bin/activate`
  - Windows: `venv\Scripts\activate`
- **Verify activation**: `python --version && pip --version`

### Package Management
- **Install project dependencies**: 
  - `pip install -r requirements.txt` -- takes 1 second (currently empty). NEVER CANCEL.
- **Install development tools**:
  - `pip install --timeout 120 --retries 10 pytest black flake8 mypy` -- takes 2-5 minutes on good network, may fail with network timeouts. NEVER CANCEL. Set timeout to 10+ minutes.
  - **WARNING**: Network connectivity to PyPI may be unreliable. If pip install fails with ReadTimeoutError, this is a known network issue, not a code problem.
  - **Workaround for network issues**: Try installing packages one at a time: `pip install pytest`, `pip install black`, etc.

### Development Tools Validation
- **pytest**: `pytest --version` (when available)
- **black**: `black --version` (when available)  
- **flake8**: `flake8 --version` (when available)
- **mypy**: `mypy --version` (when available)

### Code Quality and Testing
- **Format code**: `black .` or `black filename.py`
- **Lint code**: `flake8 .` or `flake8 filename.py`
- **Type check**: `mypy .` or `mypy filename.py`
- **Run tests**: `pytest` or `pytest -v` for verbose output
- **Run tests with coverage** (if coverage installed): `pytest --cov=.`

### Basic Python Development
- **Run Python files**: `python filename.py`
- **Interactive Python**: `python` or `python3`
- **Validate Python syntax**: `python -m py_compile filename.py`

## Validation Scenarios

**ALWAYS test these scenarios after making changes to ensure functionality:**

### Basic Development Workflow Test
1. **Create a simple Python module**:
   ```python
   def greet(name: str) -> str:
       """Return a greeting message."""
       return f"Hello, {name}!"
   
   if __name__ == "__main__":
       print(greet("World"))
   ```

2. **Run the module**: `python module_name.py` - should output "Hello, World!"

3. **Test with pytest** (create test file):
   ```python
   from module_name import greet
   
   def test_greet():
       assert greet("Alice") == "Hello, Alice!"
   ```

4. **Run tests**: `pytest test_module_name.py -v` - should pass

5. **Format and lint**: 
   - `black module_name.py` - should format code
   - `flake8 module_name.py` - should show no errors
   - `mypy module_name.py` - should show no type errors

## Critical Timing and Timeout Information

### Timeout Requirements
- **Virtual environment creation**: 3 seconds - use 30 second timeout
- **Empty requirements install**: 1 second - use 30 second timeout  
- **Development tools install**: 2-5 minutes normally, but may timeout due to network issues - use 10+ minute timeout
- **pytest execution**: < 1 second for simple tests - use 2 minute timeout
- **black formatting**: < 1 second - use 30 second timeout
- **flake8 linting**: < 1 second - use 30 second timeout
- **mypy type checking**: < 1 second - use 30 second timeout

### Network Connectivity Issues
- **KNOWN ISSUE**: PyPI connectivity may be unreliable causing ReadTimeoutError
- **When pip install fails**: Document as "Installation failed due to network connectivity issues" 
- **Alternative approach**: Install packages individually with retries
- **Never assume pip install failure indicates code problems**

## Repository Structure

### Current Structure
```
├── .github/
│   ├── dependabot.yml           # Dependency management configuration
│   └── instructions/
│       └── codacy.instructions.md  # Codacy MCP server configuration
├── .vscode/
│   └── extensions.json          # VS Code extension recommendations
├── .gitignore                   # Comprehensive Python gitignore
├── requirements.txt             # Python dependencies (currently empty template)
└── venv/                        # Virtual environment (create with python3 -m venv venv)
```

### Key Configuration Files
- **requirements.txt**: Currently contains only template comments, ready for dependencies
- **.gitignore**: Comprehensive Python project gitignore including venv, __pycache__, etc.
- **.vscode/extensions.json**: Recommends GitHub Copilot, Python, and development extensions
- **.github/dependabot.yml**: Automated dependency updates for pip and GitHub Actions

## VS Code Integration

### Recommended Extensions (auto-suggested via .vscode/extensions.json)
- GitHub.copilot - GitHub Copilot integration
- GitHub.copilot-chat - GitHub Copilot Chat
- ms-python.python - Python language support
- ms-python.vscode-pylance - Python IntelliSense
- ms-vscode.powershell - PowerShell support
- eamodio.gitlens - Git history and blame
- EditorConfig.EditorConfig - EditorConfig support

### VS Code Python Setup
1. **Open workspace**: Open the repository root in VS Code
2. **Select Python interpreter**: `Ctrl+Shift+P` → "Python: Select Interpreter" → choose `./venv/bin/python`
3. **Extensions will be auto-suggested** based on .vscode/extensions.json

## Codacy Integration

**CRITICAL**: Follow Codacy MCP server instructions in `.github/instructions/codacy.instructions.md`
- **After ANY file edit**: Run `codacy_cli_analyze` tool 
- **After dependency changes**: Run `codacy_cli_analyze` with trivy tool for security scanning
- **Use standard file system paths** for rootPath parameters

## Common Workflows

### Starting New Development
1. **Clone repository and navigate to it**
2. **Create virtual environment**: `python3 -m venv venv`
3. **Activate virtual environment**: `source venv/bin/activate` (Linux/Mac)
4. **Install dependencies**: `pip install -r requirements.txt`
5. **Install development tools**: `pip install pytest black flake8 mypy` (may require network retries)
6. **Start coding with proper validation workflow**

### Adding Dependencies
1. **Add to requirements.txt**: `echo "package_name==version" >> requirements.txt`
2. **Install**: `pip install -r requirements.txt`
3. **CRITICAL**: Run Codacy security analysis after any dependency changes

### Pre-commit Validation
**Always run before committing changes:**
1. **Format**: `black .`
2. **Lint**: `flake8 .`
3. **Type check**: `mypy .`
4. **Test**: `pytest`
5. **Codacy analysis**: Use Codacy MCP server tools

## Troubleshooting

### Common Issues
- **pip install timeout**: Network connectivity issue, try individual package installation
- **Virtual environment activation fails**: Ensure venv was created successfully
- **Import errors**: Verify virtual environment is activated and packages installed
- **VS Code not detecting Python**: Select correct interpreter in VS Code Python extension

### Network Connectivity
- **Symptoms**: ReadTimeoutError from pip install
- **Not a code issue**: This indicates PyPI connectivity problems
- **Workaround**: Install packages individually with longer timeouts
- **Alternative**: Use cached packages or offline installation methods

## Project Purpose

This is a **template repository** designed for "zero hour implementation" - rapid setup of Python projects with:
- ✅ Modern Python environment (3.12.3)
- ✅ Virtual environment support
- ✅ Development tool integration (pytest, black, flake8, mypy)
- ✅ VS Code configuration
- ✅ Dependency management (Dependabot)
- ✅ Code quality integration (Codacy)
- ✅ Comprehensive gitignore

**The repository is intentionally minimal** - it provides the foundation for rapid development rather than being a complete application.