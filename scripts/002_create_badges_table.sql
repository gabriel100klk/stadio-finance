-- Tabela para definir os emblemas disponíveis
CREATE TABLE IF NOT EXISTS public.badges (
  id SERIAL PRIMARY KEY,
  name TEXT NOT NULL,
  description TEXT,
  criteria TEXT NOT NULL, -- Ex: 'first_transaction', 'save_1000', 'invest_streak_7'
  image_url TEXT,
  xp_reward INT DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Ativar RLS e permitir leitura a todos
ALTER TABLE public.badges ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Badges are viewable by everyone." 
  ON public.badges FOR SELECT 
  USING (true);

-- Inserir emblemas iniciais
INSERT INTO public.badges (name, description, criteria, image_url, xp_reward) VALUES
  ('Primeiro Passo', 'Registou a sua primeira transação', 'first_transaction', '/badges/first-step.svg', 50),
  ('Poupador Iniciante', 'Economizou €100', 'save_100', '/badges/saver-beginner.svg', 100),
  ('Poupador Experiente', 'Economizou €1000', 'save_1000', '/badges/saver-expert.svg', 500),
  ('Investidor', 'Fez o seu primeiro investimento', 'first_investment', '/badges/investor.svg', 200),
  ('Consistente', 'Registou transações durante 7 dias seguidos', 'streak_7', '/badges/consistent.svg', 300),
  ('Maratonista', 'Registou transações durante 30 dias seguidos', 'streak_30', '/badges/marathon.svg', 1000),
  ('Controlador', 'Manteve despesas variáveis abaixo do orçamento por 3 meses', 'budget_control_3', '/badges/controller.svg', 750)
ON CONFLICT DO NOTHING;
