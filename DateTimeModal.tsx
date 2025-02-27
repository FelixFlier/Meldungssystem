import React, { useState, useRef, useEffect } from 'react';
import * as XLSX from 'xlsx';


interface DateTimeModalProps {
    showModal: boolean;
    onClose: () => void;
    onSubmit: (date: string, time: string, excelData: any[] | null) => void;
    incidentType: string | null;
    addToastMessage: (message: string, type: 'info' | 'success' | 'error') => void;
}


const DateTimeModal: React.FC<DateTimeModalProps> = ({ showModal, onClose, onSubmit, incidentType, addToastMessage }) => {
    const [date, setDate] = useState('');
    const [time, setTime] = useState('');
    const [excelData, setExcelData] = useState<any[] | null>(null);
    const [fileName, setFileName] = useState('');
    const [fileSize, setFileSize] = useState('');
    const fileInputRef = useRef<HTMLInputElement>(null);
    const [isFileUploaded, setIsFileUploaded] = useState(false);

    useEffect(() => {
        if (!showModal) {
            // Reset state when modal is closed
            setDate('');
            setTime('');
            setExcelData(null);
            setFileName('');
            setFileSize('');
            setIsFileUploaded(false);
            if (fileInputRef.current) {
                fileInputRef.current.value = ''; // Clear file input
            }
        }
    }, [showModal]);

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        handleFile(file);
    };
    const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
        e.preventDefault();
        e.stopPropagation();
        const file = e.dataTransfer.files?.[0];
        handleFile(file);
    };

    const formatFileSize = (bytes: number) => {
      if (bytes === 0) return '0 Bytes';
      const k = 1024;
      const sizes = ['Bytes', 'KB', 'MB', 'GB'];
      const i = Math.floor(Math.log(bytes) / Math.log(k));
      return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
    };


   const handleFile = (file: File | undefined) => {
        if (!file) return;

        if (!file.name.match(/\.(xlsx|xls)$/i)) {
            addToastMessage("Bitte nur Excel-Dateien hochladen (XLSX, XLS)", "error");
            return;
        }

        setFileName(file.name);
        setFileSize(formatFileSize(file.size));
        setIsFileUploaded(true);

        const reader = new FileReader();
        reader.onload = (e: ProgressEvent<FileReader>) => {
            try {
                const data = new Uint8Array(e.target?.result as ArrayBuffer);
                const workbook = XLSX.read(data, { type: 'array' });
                const firstSheet = workbook.Sheets[workbook.SheetNames[0]];
                const jsonData = XLSX.utils.sheet_to_json(firstSheet);
                setExcelData(jsonData);
                addToastMessage("Excel-Datei erfolgreich verarbeitet", "success");

            } catch (error) {
                console.error('Excel processing error:', error);
                addToastMessage("Fehler beim Verarbeiten der Excel-Datei", "error");
                removeExcelFile(); // Reset on error
            }
        };
        reader.readAsArrayBuffer(file); // Important: Read as ArrayBuffer
    };

    const removeExcelFile = () => {
        setExcelData(null);
        setFileName('');
        setFileSize('');
        setIsFileUploaded(false);
        if (fileInputRef.current) {
            fileInputRef.current.value = '';
        }
    };


    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        onSubmit(date, time, excelData);
    };


    if (!showModal) return null;

    return (
        <div className="fixed inset-0 bg-black/70 flex items-center justify-center backdrop-blur-sm z-50 modal-backdrop">
            <div className="glass p-8 rounded-2xl w-full max-w-2xl mx-4">
                <div className="flex justify-between items-center mb-6">
                    <h3 className="text-xl font-bold text-white">Tatzeit erfassen</h3>
                    <button onClick={onClose} className="text-gray-400 hover:text-white transition-colors">
                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                        </svg>
                    </button>
                </div>
                <form onSubmit={handleSubmit} className="space-y-6">
                    <input type="hidden" value={incidentType || ''} />

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                        <div>
                            <label className="block text-sm font-medium text-gray-200 mb-2">
                                Datum der Tat <span className="text-red-500">*</span>
                            </label>
                            <input
                                type="date"
                                value={date}
                                onChange={(e) => setDate(e.target.value)}
                                className="w-full px-4 py-2 bg-black/20 rounded-lg border border-white/10 focus:border-blue-500 text-white"
                                required
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-200 mb-2">
                                Uhrzeit der Tat <span className="text-red-500">*</span>
                            </label>
                            <input
                                type="time"
                                value={time}
                                onChange={(e) => setTime(e.target.value)}
                                className="w-full px-4 py-2 bg-black/20 rounded-lg border border-white/10 focus:border-blue-500 text-white"
                                required
                            />
                        </div>
                    </div>

                    <div className="border-t border-gray-700 pt-6">
                        <label className="block text-sm font-medium text-gray-200 mb-4">
                            Optional: Excel-Datei für zusätzliche Informationen
                        </label>
                        <div
                            id="drop-zone"
                            onDrop={handleDrop}
                            onDragOver={(e) => { e.preventDefault(); e.stopPropagation(); }}
                            onDragEnter={(e) => { e.preventDefault(); e.stopPropagation(); }}
                            onDragLeave={(e) => { e.preventDefault(); e.stopPropagation(); }}

                            className="relative flex flex-col items-center p-6 border-2 border-dashed border-gray-600 rounded-lg hover:border-blue-500 transition-colors cursor-pointer"
                        >
                            <svg className="w-12 h-12 text-gray-400 mb-4" fill="none" stroke="currentColor" viewBox="0 0 48 48">
                <path d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02"
                    strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                            </svg>
                            <div className="text-center">
                                <div className="flex text-sm text-gray-400 mb-2">
                                    <label htmlFor="excel-upload" className="relative cursor-pointer">
                                        <span className="text-blue-500 hover:text-blue-400 font-medium">Datei auswählen</span>
                                        <input
                                          id="excel-upload"
                                          name="excel-upload"
                                          type="file"
                                          accept=".xlsx,.xls"
                                          className="sr-only"
                                          onChange={handleFileChange}
                                          ref={fileInputRef}
                                        />
                                    </label>
                                    <p className="pl-1">oder hier ablegen</p>
                                </div>
                                <p className="text-xs text-gray-500">Unterstützte Formate: XLSX, XLS</p>
                            </div>
                        </div>

                         {isFileUploaded && (
                          <div className="mt-4 p-4 bg-black/20 rounded-lg">
                            <div className="flex items-center justify-between">
                              <div className="flex items-center space-x-3">
                                <svg className="w-6 h-6 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"/>
                                </svg>
                                <div>
                                  <p className="text-sm font-medium text-gray-200">{fileName}</p>
                                  <p className="text-xs text-gray-400">{fileSize}</p>
                                </div>
                              </div>
                              <button type="button" onClick={removeExcelFile}
                                className="text-gray-400 hover:text-white transition-colors">
                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"/>
                                </svg>
                              </button>
                            </div>
                          </div>
                        )}
                    </div>

                    <div className="flex justify-end pt-6">
                        <button
                            type="submit"
                            className="btn-gradient px-6 py-2 rounded-lg flex items-center space-x-2 hover:shadow-lg hover:shadow-green-500/25 transition-all"
                        >
                            <span>Weiter</span>
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14 5l7 7m0 0l-7 7m7-7H3" />
                            </svg>
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default DateTimeModal;