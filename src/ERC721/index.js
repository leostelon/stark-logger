const { executeCommand } = require("./pool");

class ERC721Logger {
	_indexing = false;
	_erc721Logs = [];

	constructor() {}

	async _addLogs(logs) {
		try {
			this._erc721Logs = this._erc721Logs.concat(logs);
			if (!this._indexing) {
				this._captureLogs();
			}
		} catch (error) {
			console.log({ ERC721_ADDLOGS: error.message });
		}
	}

	_captureLogs() {
		try {
			this._indexing = true;

			while (this._indexing) {
				const log = this._getLog();
				if (!log) return;

				executeCommand(log);
			}
		} catch (error) {
			console.log({ CAPTURE_LOGS_721: error.message });
		}
	}

	_getLog() {
		try {
			const log = this._erc721Logs.pop();
			if (!log) {
				if (this._indexing) {
					this._indexing = false;
				}
				return false;
			}
			return log;
		} catch (error) {
			console.log({ GETLOG_721: error.message });
			return false;
		}
	}
}

module.exports = { ERC721Logger };
