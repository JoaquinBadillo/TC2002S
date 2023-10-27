import { jsPDF } from "jspdf";
import { useRef } from "preact/hooks";

export default function Slide({title, summary, img}: {title: string, summary: string, img: any}) {
    if (!title || !summary || !img)
        return null;

    const slideRef = useRef<any>(null);

    const SlideToPDF = () => {
        if (!slideRef.current)
            return;

        const doc = new jsPDF({
          orientation: "landscape",
          format: [1248, 702],
          unit: "px"
        });

        doc.html(slideRef.current, {
            async callback(doc) {
                if (doc.internal.pages.length > 1)
                    doc.deletePage(2);
                
                doc.save("Slide");
            }

        });
    };
    
    return (
        <>
        <hr/>
        <div className="content-wrapper">
            <section className="slide-content" ref={slideRef}>
                <div className="summary">
                    <h2 className="title">{title}</h2>
                    <p>{summary}</p>
                </div>
                <img
                  src={`data:image/jpeg;base64,${img}`} 
                  alt="Generated Image" 
                />
            </section>
            <hr/>
            <button onClick={SlideToPDF} >Export</button>
        </div>
        </>
    );
}