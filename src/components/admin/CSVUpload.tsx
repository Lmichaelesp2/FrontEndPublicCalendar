'use client';
import { useState } from 'react';
import { Upload, FileText } from 'lucide-react';
import { parseCSV, parseTSV, validateEvent, EventInput } from '../../lib/csvParser';

type CSVUploadProps = {
  onEventsLoaded: (events: EventInput[]) => void;
};

export function CSVUpload({ onEventsLoaded }: CSVUploadProps) {
  const [dragActive, setDragActive] = useState(false);
  const [pasteText, setPasteText] = useState('');
  const [error, setError] = useState('');

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    setError('');

    const files = Array.from(e.dataTransfer.files);
    if (files.length > 0) {
      processFiles(files);
    }
  };

  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    if (files.length > 0) {
      processFiles(files);
    }
  };

  const processFiles = async (files: File[]) => {
    console.log(`Processing ${files.length} file(s)`);
    setError('');

    try {
      const allEvents: EventInput[] = [];
      const errors: string[] = [];

      for (const file of files) {
        try {
          const events = await processFileAsync(file);
          allEvents.push(...events);
        } catch (err) {
          errors.push(`${file.name}: ${err instanceof Error ? err.message : 'Failed to parse'}`);
        }
      }

      if (allEvents.length === 0 && errors.length > 0) {
        setError(errors.join('; '));
        return;
      }

      if (allEvents.length === 0) {
        setError('No valid events found in any file. Check that your CSV has the required columns: Name and Start Date');
        return;
      }

      const invalidEvents = allEvents.filter(event => validateEvent(event).length > 0);
      if (invalidEvents.length > 0) {
        console.warn('Invalid events found:', invalidEvents);
      }

      onEventsLoaded(allEvents);

      if (errors.length > 0) {
        setError(`Successfully loaded ${allEvents.length} events. Some files had errors: ${errors.join('; ')}`);
      }
    } catch (err) {
      console.error('Error processing files:', err);
      setError(err instanceof Error ? err.message : 'Failed to process files');
    }
  };

  const processFileAsync = (file: File): Promise<EventInput[]> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = (e) => {
        try {
          const text = e.target?.result as string;
          const events = file.name.endsWith('.tsv') ? parseTSV(text) : parseCSV(text);
          resolve(events);
        } catch (err) {
          reject(err);
        }
      };
      reader.onerror = () => reject(new Error('Failed to read file'));
      reader.readAsText(file);
    });
  };

  const handlePaste = () => {
    setError('');
    try {
      console.log('Parsing pasted text, length:', pasteText.length);
      const events = pasteText.includes('\t') ? parseTSV(pasteText) : parseCSV(pasteText);
      console.log('Events parsed from paste:', events.length);

      if (events.length === 0) {
        setError('No valid events found. Check that your data has the required columns: Name and Start Date');
        return;
      }

      const invalidEvents = events.filter(event => validateEvent(event).length > 0);
      if (invalidEvents.length > 0) {
        console.warn('Invalid events found:', invalidEvents);
        setError(`${invalidEvents.length} events have validation errors. They will still be shown for review.`);
      }

      onEventsLoaded(events);
      setPasteText('');
    } catch (err) {
      console.error('Error parsing pasted data:', err);
      setError(err instanceof Error ? err.message : 'Failed to parse data');
    }
  };

  return (
    <div className="csv-upload">
      <div className="upload-section">
        <h3>Upload CSV/TSV File</h3>
        <div
          className={`upload-dropzone ${dragActive ? 'active' : ''}`}
          onDragEnter={handleDrag}
          onDragLeave={handleDrag}
          onDragOver={handleDrag}
          onDrop={handleDrop}
        >
          <Upload size={48} />
          <p className="upload-text">Drag and drop your CSV/TSV files here</p>
          <p className="upload-subtext">Multiple files supported • or</p>
          <label className="upload-button">
            <input
              type="file"
              accept=".csv,.tsv,.txt"
              multiple
              onChange={handleFileInput}
              style={{ display: 'none' }}
            />
            <span>Browse Files</span>
          </label>
        </div>

        <div className="format-help">
          <FileText size={16} />
          <div>
            <strong>Required columns:</strong> name, start_date
            <br />
            <strong>Optional columns:</strong> start_time, end_date, end_time, website, description,
            paid, address, zipcode, org_name, org_id, org_type, event_type, event_city, state, source, notes, internal_type, participation, part_of_town, city_calendar, status
          </div>
        </div>
      </div>

      <div className="paste-section">
        <h3>Or Paste Data</h3>
        <p className="paste-help">Copy from Excel/Google Sheets and paste here</p>
        <textarea
          value={pasteText}
          onChange={(e) => setPasteText(e.target.value)}
          placeholder="Paste your event data here (tab or comma separated)"
          rows={10}
        />
        <button
          onClick={handlePaste}
          disabled={!pasteText.trim()}
          className="btn btn-gold"
        >
          Parse Data
        </button>
      </div>

      {error && <div className="form-message error">{error}</div>}
    </div>
  );
}
