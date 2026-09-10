/**
 * Model: Despesa (saída de dinheiro)
 * ----------------------------------
 * Campos:
 *  - userId     : referência (ObjectId) ao usuário dono da despesa.
 *                 Obrigatório e indexado (as consultas sempre filtram por ele).
 *  - descricao  : o que é a despesa (ex.: "Conta de luz", "Mercado"). Obrigatório.
 *  - categoria  : agrupador para relatórios (ex.: "Moradia", "Alimentação").
 *                 Opcional — assume "Outros" quando não informado.
 *  - valor      : quantia a pagar, em número. Obrigatório e não-negativo.
 *  - vencimento : data de vencimento do pagamento. Opcional.
 *  - createdAt  : data de registro da despesa. Gerada automaticamente pelo
 *                 `timestamps` do Mongoose (que também cria `updatedAt`).
 */
import mongoose from 'mongoose';

const despesaSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true,
    },
    descricao: {
      type: String,
      required: [true, 'descricao é obrigatória'],
      trim: true,
    },
    categoria: {
      type: String,
      trim: true,
      default: 'Outros',
    },
    valor: {
      type: Number,
      required: [true, 'valor é obrigatório'],
      min: [0, 'valor não pode ser negativo'],
    },
    vencimento: {
      type: Date,
    },
  },
  { timestamps: true },
);

export const Despesa = mongoose.model('Despesa', despesaSchema);
