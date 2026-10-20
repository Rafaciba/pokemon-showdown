/**
 * pokemon-showdown-custom: modelo de avaliação de posição da IA Mestre.
 *
 * Regressão logística sobre as características da posição (position.ts): estima a
 * chance de vitória de quem vê a posição. O treino fica aqui (e não só nas
 * ferramentas) porque o servidor também vai retreinar o modelo com as batalhas reais
 * (etapa 4 da IA Mestre). Sem dependências: gradiente descendente com Adam e L2.
 *
 * @license MIT
 */

export interface ValueModel {
	version: string;
	/** Quantas posições (e batalhas) foram usadas no treino. */
	samples: number;
	battles: number;
	features: readonly string[];
	/** Normalização: (x - mean) / scale. */
	mean: number[];
	scale: number[];
	weights: number[];
	bias: number;
}

export function winProbability(model: ValueModel, features: readonly number[]) {
	let z = model.bias;
	for (let i = 0; i < model.weights.length; i++) {
		z += model.weights[i] * ((features[i] ?? 0) - model.mean[i]) / model.scale[i];
	}
	return 1 / (1 + Math.exp(-z));
}

/** Posições de treino: `rows` linhas de `width` características, e o resultado (1 = vitória). */
export interface Dataset {
	x: Float32Array;
	y: Float32Array;
	rows: number;
	width: number;
}

export interface TrainOptions {
	epochs?: number;
	batchSize?: number;
	learningRate?: number;
	l2?: number;
	/** Embaralhamento determinístico. */
	random?: () => number;
	/**
	 * Modelo de partida (retreino com as batalhas reais): os pesos começam nele, a
	 * normalização é a dele, e a regularização puxa para ele (`priorStrength`) em vez
	 * de para zero, para poucos dados não estragarem o que já se sabe.
	 */
	prior?: ValueModel;
	priorStrength?: number;
}

/** Treina a regressão logística. `features` são os nomes (na ordem das colunas). */
export function trainValueModel(
	data: Dataset, features: readonly string[], info: { version: string, battles: number }, options: TrainOptions = {}
): ValueModel {
	const { rows, width, x, y } = data;
	const epochs = options.epochs ?? 8;
	const batchSize = options.batchSize ?? 256;
	const rate = options.learningRate ?? 0.01;
	const l2 = options.l2 ?? 1e-4;
	const random = options.random ?? Math.random;

	const prior = options.prior;
	const priorStrength = options.priorStrength ?? 0.01;
	let mean: number[];
	let scale: number[];
	if (prior) {
		mean = [...prior.mean];
		scale = [...prior.scale];
	} else {
		mean = new Array<number>(width).fill(0);
		scale = new Array<number>(width).fill(0);
		for (let r = 0; r < rows; r++) for (let c = 0; c < width; c++) mean[c] += x[r * width + c] / rows;
		for (let r = 0; r < rows; r++) {
			for (let c = 0; c < width; c++) scale[c] += (x[r * width + c] - mean[c]) ** 2 / rows;
		}
		for (let c = 0; c < width; c++) scale[c] = Math.sqrt(scale[c]) || 1;
	}

	const weights = prior ? [...prior.weights] : new Array<number>(width).fill(0);
	let bias = prior ? prior.bias : 0;
	// Adam
	const m = new Array<number>(width + 1).fill(0);
	const v = new Array<number>(width + 1).fill(0);
	const beta1 = 0.9;
	const beta2 = 0.999;
	let step = 0;
	const order = Array.from({ length: rows }, (_, i) => i);
	const grad = new Array<number>(width + 1).fill(0);
	for (let epoch = 0; epoch < epochs; epoch++) {
		for (let i = rows - 1; i > 0; i--) {
			const j = Math.floor(random() * (i + 1));
			[order[i], order[j]] = [order[j], order[i]];
		}
		for (let start = 0; start < rows; start += batchSize) {
			const end = Math.min(rows, start + batchSize);
			grad.fill(0);
			for (let k = start; k < end; k++) {
				const r = order[k];
				let z = bias;
				for (let c = 0; c < width; c++) z += weights[c] * (x[r * width + c] - mean[c]) / scale[c];
				const error = 1 / (1 + Math.exp(-z)) - y[r];
				for (let c = 0; c < width; c++) grad[c] += error * (x[r * width + c] - mean[c]) / scale[c];
				grad[width] += error;
			}
			step++;
			const count = end - start;
			for (let c = 0; c <= width; c++) {
				// Regularização: para zero, ou para o modelo de partida
				const anchor = prior ? (c < width ? prior.weights[c] : prior.bias) : 0;
				const strength = prior ? priorStrength : (c < width ? l2 : 0);
				const current = c < width ? weights[c] : bias;
				const g = grad[c] / count + strength * (current - anchor);
				m[c] = beta1 * m[c] + (1 - beta1) * g;
				v[c] = beta2 * v[c] + (1 - beta2) * g * g;
				const update = rate * (m[c] / (1 - beta1 ** step)) / (Math.sqrt(v[c] / (1 - beta2 ** step)) + 1e-8);
				if (c < width) weights[c] -= update;
				else bias -= update;
			}
		}
	}
	return {
		version: info.version, samples: rows, battles: info.battles, features: [...features], mean, scale, weights, bias,
	};
}

/** Perda logarítmica média e acerto (chance > 50% para quem venceu) num conjunto de posições. */
export function scoreValueModel(model: ValueModel, data: Dataset) {
	let loss = 0;
	let correct = 0;
	const row = new Array<number>(data.width);
	for (let r = 0; r < data.rows; r++) {
		for (let c = 0; c < data.width; c++) row[c] = data.x[r * data.width + c];
		const p = Math.min(1 - 1e-7, Math.max(1e-7, winProbability(model, row)));
		loss -= data.y[r] ? Math.log(p) : Math.log(1 - p);
		if ((p > 0.5) === (data.y[r] === 1)) correct++;
	}
	return { logLoss: loss / data.rows, accuracy: correct / data.rows };
}
