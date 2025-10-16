-- Tabela para associar emblemas conquistados aos utilizadores
CREATE TABLE IF NOT EXISTS public.user_badges (
  user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
  badge_id INT REFERENCES public.badges(id) ON DELETE CASCADE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  PRIMARY KEY (user_id, badge_id)
);

-- Ativar RLS
ALTER TABLE public.user_badges ENABLE ROW LEVEL SECURITY;

-- Política: Utilizadores podem ver os seus próprios emblemas
CREATE POLICY "Users can view their own badges." 
  ON public.user_badges FOR SELECT 
  USING (auth.uid() = user_id);

-- Política: Todos podem ver emblemas de outros (para perfis públicos)
CREATE POLICY "Allow authenticated users to view all earned badges." 
  ON public.user_badges FOR SELECT 
  USING (auth.role() = 'authenticated');

-- Política: Sistema pode inserir emblemas (via função)
CREATE POLICY "Allow service role to insert badges." 
  ON public.user_badges FOR INSERT 
  WITH CHECK (true);

-- Índice para melhorar performance
CREATE INDEX IF NOT EXISTS idx_user_badges_user ON public.user_badges(user_id);
CREATE INDEX IF NOT EXISTS idx_user_badges_badge ON public.user_badges(badge_id);
