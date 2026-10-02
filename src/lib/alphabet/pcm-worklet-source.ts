export const PCM_WORKLET_SOURCE = `
const CHUNK_SAMPLES = 2048; // ~128ms at 16kHz

class PcmRecorderProcessor extends AudioWorkletProcessor {
  constructor() {
    super();
    this.id = 0;
    this.capturing = false;
    this.announced = false;
    this.buffer = new Int16Array(CHUNK_SAMPLES);
    this.filled = 0;
    this.port.onmessage = (event) => {
      const msg = event.data || {};
      if (msg.type === "start") {
        this.id = msg.id;
        this.filled = 0;
        this.announced = false;
        this.capturing = true;
      } else if (msg.type === "stop") {
        if (!this.capturing || this.id !== msg.id) return;
        this.capturing = false;
        this.flush();
        this.port.postMessage({ type: "end", id: this.id });
      }
    };
  }

  flush() {
    if (this.filled === 0) return;
    const out = this.buffer.slice(0, this.filled);
    this.filled = 0;
    this.port.postMessage({ type: "chunk", id: this.id, pcm: out }, [out.buffer]);
  }

  process(inputs) {
    if (!this.capturing) return true;
    const input = inputs[0] && inputs[0][0];
    if (!input || input.length === 0) return true;

    if (!this.announced) {
      this.announced = true;
      this.port.postMessage({ type: "started", id: this.id });
    }
    for (let i = 0; i < input.length; i++) {
      const s = input[i] < -1 ? -1 : input[i] > 1 ? 1 : input[i];
      this.buffer[this.filled++] = s < 0 ? s * 0x8000 : s * 0x7fff;
      if (this.filled === CHUNK_SAMPLES) this.flush();
    }
    return true;
  }
}

registerProcessor("pcm-recorder", PcmRecorderProcessor);
`;
