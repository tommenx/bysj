import model.SearchModel;
import org.json.JSONArray;
import org.json.JSONObject;
import util.EsOperation;

import javax.servlet.ServletException;
import javax.servlet.annotation.WebServlet;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import java.io.IOException;
import java.io.PrintWriter;
import java.util.List;

/**
 * Created by tommenx on 2018/3/19.
 */
@WebServlet("/doSearch")
public class SearchServlet extends HttpServlet {
    @Override
    protected void doGet(HttpServletRequest req, HttpServletResponse resp) throws ServletException, IOException {
        doPost(req, resp);
    }

    @Override
    protected void doPost(HttpServletRequest req, HttpServletResponse resp) throws ServletException, IOException {
        resp.setContentType("text/html;charset=utf-8");
        resp. setCharacterEncoding("UTF-8");
        String key = req.getParameter("key");
        List<SearchModel> hits;
        try {
            EsOperation operation = new EsOperation();
            hits = operation.queryByMatch(key);
            JSONArray array = new JSONArray();
            for(SearchModel search:hits){
                JSONObject obj = new JSONObject();
                obj.put("userId",search.getUserId());
                obj.put("typeId",search.getTypeId());
                obj.put("title",search.getTitle());
                obj.put("downloadUrl",search.getDownloadUrl());
                obj.put("hit",search.getHit());
                array.put(obj);
            }
            JSONObject obj = new JSONObject();
            obj.put("search",array);
            PrintWriter writer = resp.getWriter();
            writer.println(obj);

        } catch (Exception e) {
            e.printStackTrace();
        }
    }
}
