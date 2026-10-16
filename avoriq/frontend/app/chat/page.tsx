"use client";

import { useState } from "react";
import ChatEngine from "../../components/ChatEngine";
import ScholarshipDetailModal from "../../components/ScholarshipDetailModal";
import { Scholarship } from "../../types/scholarship";
import { useLocalStorage } from "../../hooks/useLocalStorage";

export default function ChatPage() {
  const [selectedScholarship, setSelectedScholarship] = useState<Scholarship | null>(null);
  const [savedIds, setSavedIds] = useLocalStorage<string[]>("avoriq_saved", []);

  const handleToggleSave = (id: string) => {
    setSavedIds((prev) =>
      prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id]
    );
  };

  return (
    <div className="h-full w-full overflow-hidden flex flex-col">
      <ChatEngine 
        onOpenDetails={setSelectedScholarship}
        savedIds={savedIds}
        onToggleSave={handleToggleSave}
      />

      {/* Detail Modal */}
      {selectedScholarship && (
        <ScholarshipDetailModal
          scholarship={selectedScholarship}
          isOpen={!!selectedScholarship}
          onClose={() => setSelectedScholarship(null)}
          isSaved={savedIds.includes(selectedScholarship.id)}
          onToggleSave={() => handleToggleSave(selectedScholarship.id)}
        />
      )}
    </div>
  );
}
