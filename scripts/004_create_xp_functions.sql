-- Função para adicionar XP a um utilizador
CREATE OR REPLACE FUNCTION add_xp(user_id_input UUID, xp_amount INT)
RETURNS VOID AS $$
BEGIN
  UPDATE public.profiles
  SET xp = xp + xp_amount, updated_at = NOW()
  WHERE id = user_id_input;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Função para atribuir um emblema a um utilizador
CREATE OR REPLACE FUNCTION award_badge(user_id_input UUID, badge_criteria TEXT)
RETURNS VOID AS $$
DECLARE
  badge_record RECORD;
BEGIN
  -- Buscar o emblema pelo critério
  SELECT * INTO badge_record FROM public.badges WHERE criteria = badge_criteria LIMIT 1;
  
  IF badge_record.id IS NOT NULL THEN
    -- Inserir o emblema se ainda não foi conquistado
    INSERT INTO public.user_badges (user_id, badge_id)
    VALUES (user_id_input, badge_record.id)
    ON CONFLICT (user_id, badge_id) DO NOTHING;
    
    -- Adicionar XP de recompensa
    IF badge_record.xp_reward > 0 THEN
      PERFORM add_xp(user_id_input, badge_record.xp_reward);
    END IF;
  END IF;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Função para obter o ranking de utilizadores
CREATE OR REPLACE FUNCTION get_leaderboard(limit_count INT DEFAULT 100)
RETURNS TABLE (
  id UUID,
  username TEXT,
  avatar_url TEXT,
  xp BIGINT,
  rank BIGINT
) AS $$
BEGIN
  RETURN QUERY
  SELECT 
    p.id,
    p.username,
    p.avatar_url,
    p.xp,
    ROW_NUMBER() OVER (ORDER BY p.xp DESC) as rank
  FROM public.profiles p
  WHERE p.username IS NOT NULL
  ORDER BY p.xp DESC
  LIMIT limit_count;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
