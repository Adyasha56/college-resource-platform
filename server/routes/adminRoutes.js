import { loginAdmin, createAdmin } from "../controllers/adminController.js";

const router = express.Router();

router.post("/login", loginAdmin);
router.post("/register", createAdmin); // 

export default router;
