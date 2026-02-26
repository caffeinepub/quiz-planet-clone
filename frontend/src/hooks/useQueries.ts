import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useActor } from './useActor';

export function useCheckUsernameAvailable(username: string) {
  const { actor, isFetching } = useActor();
  return useQuery({
    queryKey: ['checkUsername', username],
    queryFn: async () => {
      if (!actor || !username) return true;
      return actor.checkUsernameAvailable(username);
    },
    enabled: !!actor && !isFetching && username.length > 0,
    staleTime: 5000,
  });
}

export function useStartNewGame() {
  const { actor } = useActor();
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (playerName: string) => {
      if (!actor) throw new Error('Actor not ready');
      return actor.startNewGame(playerName);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['question'] });
      queryClient.invalidateQueries({ queryKey: ['score'] });
      queryClient.invalidateQueries({ queryKey: ['isFinished'] });
    },
  });
}

export function useGetQuestion(playerName: string) {
  const { actor, isFetching } = useActor();
  return useQuery({
    queryKey: ['question', playerName],
    queryFn: async () => {
      if (!actor || !playerName) return null;
      return actor.getQuestion(playerName);
    },
    enabled: !!actor && !isFetching && playerName.length > 0,
    staleTime: Infinity,
  });
}

export function useGetPlayerScore(playerName: string) {
  const { actor, isFetching } = useActor();
  return useQuery({
    queryKey: ['score', playerName],
    queryFn: async () => {
      if (!actor || !playerName) return BigInt(0);
      return actor.getPlayerScore(playerName);
    },
    enabled: !!actor && !isFetching && playerName.length > 0,
  });
}

export function useIsGameFinished(playerName: string) {
  const { actor, isFetching } = useActor();
  return useQuery({
    queryKey: ['isFinished', playerName],
    queryFn: async () => {
      if (!actor || !playerName) return false;
      return actor.isGameFinished(playerName);
    },
    enabled: !!actor && !isFetching && playerName.length > 0,
  });
}

export function useAnswerQuestion() {
  const { actor } = useActor();
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ playerName, answerIndex }: { playerName: string; answerIndex: bigint }) => {
      if (!actor) throw new Error('Actor not ready');
      return actor.answerQuestion(playerName, answerIndex);
    },
    onSuccess: (_data, variables) => {
      queryClient.invalidateQueries({ queryKey: ['score', variables.playerName] });
      queryClient.invalidateQueries({ queryKey: ['isFinished', variables.playerName] });
      queryClient.invalidateQueries({ queryKey: ['question', variables.playerName] });
    },
  });
}

export function useGetHighScores() {
  const { actor, isFetching } = useActor();
  return useQuery({
    queryKey: ['highScores'],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getHighScores();
    },
    enabled: !!actor && !isFetching,
  });
}
