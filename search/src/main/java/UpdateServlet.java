import model.FileModel;
import org.json.JSONObject;
import util.EsOperation;

import javax.servlet.ServletException;
import javax.servlet.annotation.WebServlet;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import java.io.IOException;
import java.io.PrintWriter;

/**
 * Created by tommenx on 2018/3/19.
 */
@WebServlet("/doUpdate")
public class UpdateServlet extends HttpServlet {

    @Override
    protected void doGet(HttpServletRequest req, HttpServletResponse resp) throws ServletException, IOException {
        doPost(req, resp);
    }

    @Override
    protected void doPost(HttpServletRequest req, HttpServletResponse resp) throws ServletException, IOException {
        try {
            int id = Integer.parseInt(req.getParameter("id"));
            String title = req.getParameter("title");
            EsOperation operation = new EsOperation();
            FileModel model = new FileModel();
            model.setId(id);
            model.setTitle(title);
            operation.updateDoc(model);
            JSONObject obj = new JSONObject();
            obj.put("code",1);
            PrintWriter writer = resp.getWriter();
            writer.println(obj);

        } catch (Exception e) {
            e.printStackTrace();
        }
    }
}
