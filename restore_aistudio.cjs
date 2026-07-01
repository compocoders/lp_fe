const fs = require('fs');
const path = require('path');

const filePath = path.join(__dirname, 'src', 'pages', 'dashboard', 'AiStudioPage.jsx');
let content = fs.readFileSync(filePath, 'utf-8');

const anchor = `  const navigate = useNavigate();
  const [activeThreadId, setActiveThreadId] = useState(null);`;

const restoration = `  const navigate = useNavigate();
  const location = useLocation();
  const { virtualTokens, isTokensExhausted, setVirtualTokens, setNextResetAt } = useAIStore();
  
  const [classroom, setClassroom] = useState(null);
  const [materials, setMaterials] = useState([]);
  const [activeMaterialId, setActiveMaterialId] = useState(initialMaterialId || null);
  const [showMaterialPicker, setShowMaterialPicker] = useState(false);
  
  const autoTriggerRef = useRef(false);
  
  const [showLeftSidebar, setShowLeftSidebar] = useState(false);
  const [showRightSidebar, setShowRightSidebar] = useState(false);

  const [conversations, setConversations] = useState([]);
  const [savedMaterials, setSavedMaterials] = useState([]);
  const [activeThreadId, setActiveThreadId] = useState(null);`;

if (content.includes(anchor)) {
  content = content.replace(anchor, restoration);
  fs.writeFileSync(filePath, content);
  console.log("Restored deleted lines successfully.");
} else {
  console.log("Could not find the anchor to restore.");
}
