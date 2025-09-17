
import fs from 'fs/promises';
import path from 'path';

const logFilePath = path.join(process.cwd(), 'app.log');

export async function logError(error: any, context: string) {
  const timestamp = new Date().toISOString();
  let errorMessage: string;

  if (error instanceof Error) {
    errorMessage = error.stack || error.message;
  } else if (typeof error === 'object' && error !== null) {
    errorMessage = JSON.stringify(error, null, 2);
  } else {
    errorMessage = String(error);
  }

  const logEntry = `[${timestamp}] [${context}]\n${errorMessage}\n\n`;

  try {
    await fs.appendFile(logFilePath, logEntry);
  } catch (writeError) {
    console.error('FATAL: Failed to write to log file.', writeError);
    console.error('Original error:', logEntry);
  }
}
