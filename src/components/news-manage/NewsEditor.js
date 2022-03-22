import React,{ useState } from 'react'
import { Editor } from 'react-draft-wysiwyg'
import{ convertToRaw } from 'draft-js'
import 'react-draft-wysiwyg/dist/react-draft-wysiwyg.css'
import draftjsToHtml from 'draftjs-to-html';

export default function NewsEditor(props) {

    const [editorState, seteditorState] = useState("");
  return (
    <div>
        <Editor 
            editorState={editorState}
            onEditorStateChange={(editorState)=>
                seteditorState(editorState)}
            onBlur={() => {
                props.getContent(draftjsToHtml(convertToRaw
                    (editorState.getCurrentContent())))
            }}
        />
    </div>
  )
}
