import DatabaseError from "sequelize/lib/errors/database-error";

/**
 * see https://github.com/sequelize/sequelize/issues/14807
 */
export class ImprovedSequelizeError extends Error {
	constructor(originalError: DatabaseError) {
		super();
		this.name = originalError.name;

		let { message } = originalError.parent;
		if (originalError.sql) {
			message += "\nSQL: " + originalError.sql;
		}

		if (originalError.parameters) {
			const stringifiedParameters = JSON.stringify(originalError.parameters);
			if (
				stringifiedParameters !== "undefined" &&
				stringifiedParameters !== "{}"
			) {
				message += "\nParameters: " + stringifiedParameters;
			}
		}

		message += "\n" + originalError.stack;

		this.message = message;

		Error.captureStackTrace(this, fixSequelizeError);
	}
}

const isSequelizeError = (e: unknown): e is DatabaseError =>
	e instanceof Error && e.name.startsWith("Sequelize");

const fixSequelizeError = (e: unknown) => {
	if (isSequelizeError(e)) {
		throw new ImprovedSequelizeError(e);
	}

	throw e;
};
