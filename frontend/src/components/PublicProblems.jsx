import React, { useEffect, useMemo, useState } from 'react';
import { getProblem, getProblems } from '../services/auth.js';

export default function PublicProblems() {
  const [problems, setProblems] = useState([]);
  const [search, setSearch] = useState('');
  const [difficulty, setDifficulty] = useState('All');
  const [selectedProblem, setSelectedProblem] = useState(null);
  const [loading, setLoading] = useState(true);
  const [loadingDetails, setLoadingDetails] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    getProblems()
      .then(setProblems)
      .catch((requestError) => setError(requestError.message))
      .finally(() => setLoading(false));
  }, []);

  const filteredProblems = useMemo(() => {
    const query = search.trim().toLowerCase();
    return problems.filter((problem) => {
      const matchesDifficulty =
        difficulty === 'All' || problem.difficulty === difficulty;
      const matchesSearch =
        !query ||
        problem.title.toLowerCase().includes(query) ||
        String(problem.id).includes(query);
      return matchesDifficulty && matchesSearch;
    });
  }, [problems, search, difficulty]);

  const openProblem = async (id) => {
    setLoadingDetails(true);
    setError('');
    try {
      setSelectedProblem(await getProblem(id));
    } catch (requestError) {
      setError(requestError.message);
    } finally {
      setLoadingDetails(false);
    }
  };

  return (
    <section
      id="problems"
      className="scroll-mt-24 border-y border-white/10 bg-[#0D0E14] py-20 sm:py-24"
    >
      <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
        <div className="mb-8 max-w-2xl">
          <p className="text-sm font-medium text-[#C4A5F5]">Problem library</p>
          <h2 className="mt-2 text-3xl font-semibold tracking-tight text-white sm:text-4xl">
            Find your next challenge
          </h2>
          <p className="mt-3 text-sm leading-6 text-zinc-400">
            Browse coding problems and view their details. Sign in or create an
            account whenever you are ready to start solving.
          </p>
        </div>

        <div className="mb-5 flex flex-col gap-3 sm:flex-row">
          <input
            value={search}
            onChange={(event) => setSearch(event.target.value)}
            placeholder="Search by problem title or ID"
            className="min-w-0 flex-1 rounded-xl border border-white/10 bg-[#08090D] px-4 py-3 text-sm text-white placeholder:text-zinc-600 outline-none focus:border-[#C4A5F5]/50"
            aria-label="Search problems"
          />
          <select
            value={difficulty}
            onChange={(event) => setDifficulty(event.target.value)}
            className="rounded-xl border border-white/10 bg-[#08090D] px-4 py-3 text-sm text-zinc-300 outline-none focus:border-[#C4A5F5]/50"
            aria-label="Filter problems by difficulty"
          >
            <option>All</option>
            <option>Easy</option>
            <option>Medium</option>
            <option>Hard</option>
          </select>
        </div>

        {error && (
          <p role="alert" className="mb-4 rounded-xl border border-rose-500/20 bg-rose-500/10 px-4 py-3 text-sm text-rose-300">
            {error}
          </p>
        )}

        {loading ? (
          <p className="py-10 text-center text-sm text-zinc-500">Loading problems...</p>
        ) : filteredProblems.length === 0 ? (
          <p className="py-10 text-center text-sm text-zinc-500">
            No problems match your search.
          </p>
        ) : (
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {filteredProblems.map((problem) => (
              <button
                type="button"
                key={problem.id}
                onClick={() => openProblem(problem.id)}
                className="rounded-xl border border-white/10 bg-[#08090D] p-4 text-left transition hover:border-[#C4A5F5]/40 hover:bg-white/[0.03]"
              >
                <span className="text-xs font-mono text-zinc-500">#{problem.id}</span>
                <span className="mt-2 block text-sm font-medium text-white">
                  {problem.title}
                </span>
                <span className="mt-3 inline-flex rounded-md border border-white/10 px-2 py-1 text-xs text-zinc-400">
                  {problem.difficulty}
                </span>
              </button>
            ))}
          </div>
        )}

        {loadingDetails && (
          <p className="mt-5 text-sm text-zinc-500">Loading problem details...</p>
        )}

        {selectedProblem && (
          <article className="mt-6 rounded-2xl border border-[#C4A5F5]/20 bg-[#08090D] p-5 sm:p-6">
            <div className="flex flex-wrap items-start justify-between gap-3">
              <div>
                <p className="text-xs font-mono text-[#C4A5F5]">
                  Problem #{selectedProblem.id} · {selectedProblem.difficulty}
                </p>
                <h3 className="mt-1 text-xl font-semibold text-white">
                  {selectedProblem.title}
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setSelectedProblem(null)}
                className="rounded-lg border border-white/10 px-3 py-1.5 text-xs text-zinc-400 hover:text-white"
              >
                Close details
              </button>
            </div>
            <p className="mt-4 whitespace-pre-wrap text-sm leading-6 text-zinc-300">
              {selectedProblem.description}
            </p>
            <div className="mt-5 grid gap-4 border-t border-white/10 pt-4 text-sm sm:grid-cols-3">
              <p className="text-zinc-400"><span className="text-zinc-500">Constraints: </span>{selectedProblem.constraints}</p>
              <p className="text-zinc-400"><span className="text-zinc-500">Input: </span>{selectedProblem.input_format}</p>
              <p className="text-zinc-400"><span className="text-zinc-500">Output: </span>{selectedProblem.output_format}</p>
            </div>
          </article>
        )}
      </div>
    </section>
  );
}
