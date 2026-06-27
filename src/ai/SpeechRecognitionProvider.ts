/**
 * SpeechRecognitionProvider Interface
 * Abstracts the speech recognition engine so the system can switch between
 * Whisper, Azure Speech, Google Speech, or Browser API without breaking architecture.
 */
export interface SpeechRecognitionProvider {
  /** Initialize connection, pass in language or model specs */
  initialize(config?: any): Promise<void>;
  
  /** Start listening and streaming word-level timestamps */
  startStream(onChunkMatched: (word: string, timestamp: number) => void): Promise<void>;
  
  /** Stop streaming */
  stopStream(): void;
  
  /** Get current provider name */
  getProviderName(): string;
}
