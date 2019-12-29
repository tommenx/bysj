import model.FileModel;
import org.elasticsearch.client.Client;
import org.elasticsearch.common.collect.HppcMaps;
import org.json.JSONObject;
import util.ClientFactory;
import util.EsOperation;
import util.Util;

import javax.servlet.ServletException;
import javax.servlet.annotation.WebServlet;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import java.io.IOException;
import java.io.PrintWriter;

/**
 * Created by tommenx on 2018/3/18.
 */
@WebServlet("/doAdd")
public class AddServlet extends HttpServlet {
    @Override
    protected void doGet(HttpServletRequest req, HttpServletResponse resp) throws ServletException, IOException {
        doPost(req, resp);
    }

    /**
     * id,userId,typeId,title,downloadUrl
     * @param req
     * @param resp
     * @throws ServletException
     * @throws IOException
     */
    @Override
    protected void doPost(HttpServletRequest req, HttpServletResponse resp) throws ServletException, IOException {
        resp.setContentType("text/html;charset=utf-8");

        resp. setCharacterEncoding("UTF-8");
        try {
            EsOperation operation = new EsOperation();
            int id = Integer.parseInt(req.getParameter("id"));
            int user_id = Integer.parseInt(req.getParameter("userId"));
            int type_id = Integer.parseInt(req.getParameter("typeId"));
            String title = req.getParameter("title");
            String download_url = req.getParameter("downloadUrl");
            FileModel model = new FileModel();
            model.setId(id);
            model.setTypeId(type_id);
            model.setUserId(user_id);
            model.setTitle(title);
            model.setDownloadUrl(download_url);
            //下载文件
            if(type_id==5)
                Util.downloadFile(title,download_url);

            if(type_id == 5){
                Util.getText(title,model);
            }
            else {
                model.setContent("");
            }
            operation.createDoc(model);
            JSONObject obj = new JSONObject();
            obj.put("code",1);
            PrintWriter writer = resp.getWriter();
            writer.println(obj);
        } catch (Exception e) {
            e.printStackTrace();
        }

    }
}
