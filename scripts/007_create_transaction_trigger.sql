-- Trigger para atribuir XP e emblemas quando uma transação é criada
CREATE OR REPLACE FUNCTION public.handle_transaction_gamification()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  transaction_count INT;
  investment_count INT;
  consecutive_days INT;
BEGIN
  -- Adicionar XP base por registar uma transação
  PERFORM add_xp(NEW.user_id, 10);
  
  -- Verificar se é a primeira transação
  SELECT COUNT(*) INTO transaction_count 
  FROM public.transactions 
  WHERE user_id = NEW.user_id;
  
  IF transaction_count = 1 THEN
    PERFORM award_badge(NEW.user_id, 'first_transaction');
  END IF;
  
  -- Verificar se é o primeiro investimento
  IF NEW.type = 'investment' THEN
    SELECT COUNT(*) INTO investment_count 
    FROM public.transactions 
    WHERE user_id = NEW.user_id AND type = 'investment';
    
    IF investment_count = 1 THEN
      PERFORM award_badge(NEW.user_id, 'first_investment');
    END IF;
  END IF;
  
  -- Verificar streak de dias consecutivos (simplificado)
  SELECT COUNT(DISTINCT date) INTO consecutive_days
  FROM public.transactions
  WHERE user_id = NEW.user_id
    AND date >= CURRENT_DATE - INTERVAL '7 days';
  
  IF consecutive_days >= 7 THEN
    PERFORM award_badge(NEW.user_id, 'streak_7');
  END IF;
  
  IF consecutive_days >= 30 THEN
    PERFORM award_badge(NEW.user_id, 'streak_30');
  END IF;
  
  RETURN NEW;
END;
$$;

-- Remover trigger existente se houver
DROP TRIGGER IF EXISTS on_transaction_created ON public.transactions;

-- Criar trigger
CREATE TRIGGER on_transaction_created
  AFTER INSERT ON public.transactions
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_transaction_gamification();
