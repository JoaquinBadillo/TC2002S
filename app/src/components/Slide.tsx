export default function Slide({title, summary, img}: {title: string, summary: string, img: any}) {
    if (!title || !summary || !img)
        return null;
    
    return (
        <>
        <hr/>
        <section className="slide-content">
            <div className="summary">
                <h2 className="title">{title}</h2>
                <p>{summary}</p>
            </div>
            <img 
              src={`data:image/jpeg;base64,${img}`} 
              alt="Generated Image" 
            />
        </section>
        </>
    );
}